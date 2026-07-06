const fs = require("fs");
const path = require("path");
const express = require("express");
const Appointment = require("../models/Appointment");
const Department = require("../models/Department");
const Doctor = require("../models/Doctor");
const GalleryItem = require("../models/GalleryItem");
const User = require("../models/User");
const { authRequired, requireRoles } = require("../middleware/auth");
const { uploadGallery } = require("../middleware/upload");
const { mapAppointment, mapDepartment, mapDoctor, mapGalleryItem } = require("../utils/serializers");

const router = express.Router();
const BACKEND_ROOT = path.resolve(__dirname, "../..");
const toGalleryImageUrl = (itemId) => `/api/public/gallery/${itemId}/image`;

router.use(authRequired, requireRoles("admin"));

router.get("/gallery", async (_req, res) => {
  try {
    const items = await GalleryItem.find({})
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "fullName email");

    return res.json({
      items: items.map((item) => ({
        ...mapGalleryItem(item),
        imageUrl: toGalleryImageUrl(item._id.toString()),
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch gallery items", error: error.message });
  }
});

router.post("/gallery", (req, res) => {
  uploadGallery.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Invalid upload request" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const rawTitle = String(req.body.title || "").trim();
      const title = rawTitle || req.file.originalname.replace(/\.[^/.]+$/, "");
      const description = String(req.body.description || "").trim();
      const filePath = path.relative(BACKEND_ROOT, req.file.path).split(path.sep).join("/");

      const item = await GalleryItem.create({
        title,
        description,
        fileName: req.file.originalname,
        filePath,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.user._id,
      });

      const populatedItem = await item.populate("uploadedBy", "fullName email");
      return res.status(201).json({
        item: {
          ...mapGalleryItem(populatedItem),
          imageUrl: toGalleryImageUrl(populatedItem._id.toString()),
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to upload gallery image", error: error.message });
    }
  });
});

router.patch("/gallery/:galleryId/active", async (req, res) => {
  try {
    const isActive = Boolean(req.body.isActive);
    const item = await GalleryItem.findByIdAndUpdate(req.params.galleryId, { isActive }, { new: true }).populate(
      "uploadedBy",
      "fullName email"
    );

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    return res.json({
      item: {
        ...mapGalleryItem(item),
        imageUrl: toGalleryImageUrl(item._id.toString()),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update gallery item", error: error.message });
  }
});

router.delete("/gallery/:galleryId", async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.galleryId);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    const absolutePath = path.join(BACKEND_ROOT, item.filePath);
    await GalleryItem.deleteOne({ _id: item._id });

    fs.promises.unlink(absolutePath).catch(() => {});
    return res.json({ message: "Gallery item deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete gallery item", error: error.message });
  }
});

router.get("/dashboard", async (_req, res) => {
  try {
    const [
      totalDoctors,
      totalAppointments,
      totalDepartments,
      pendingAppointments,
      recentAppointments,
      statusCounts,
      monthlyAppointments,
      doctorWiseAppointments,
    ] = await Promise.all([
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Department.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("doctor", "fullName specialty")
        .populate("patient", "fullName email")
        .populate("department", "name"),
      Appointment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Appointment.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Appointment.aggregate([
        { $group: { _id: "$doctor", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "doctors",
            localField: "_id",
            foreignField: "_id",
            as: "doctor",
          },
        },
        { $unwind: "$doctor" },
        { $project: { _id: 0, doctorId: "$doctor._id", doctorName: "$doctor.fullName", count: 1 } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Generate map of the last 30 days with 0 counts to ensure day-wise display
    const dailyMap = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyMap[dateStr] = 0;
    }

    // Populate with actual counts from database
    monthlyAppointments.forEach((item) => {
      dailyMap[item._id] = item.count;
    });

    // Convert to sorted array for the chart
    const dailyData = Object.keys(dailyMap)
      .sort()
      .map((dateStr) => ({
        month: dateStr,
        count: dailyMap[dateStr],
      }));

    return res.json({
      stats: {
        totalDoctors,
        totalAppointments,
        totalDepartments,
        pendingAppointments,
        statusBreakdown: statusCounts.map((item) => ({ status: item._id, count: item.count })),
        monthlyAppointments: dailyData,
        doctorWiseAppointments,
      },
      recentAppointments: recentAppointments.map(mapAppointment),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admin dashboard", error: error.message });
  }
});

router.get("/departments", async (_req, res) => {
  try {
    const departments = await Department.find({}).sort({ name: 1 });
    return res.json({
      departments: departments.map(mapDepartment),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch departments", error: error.message });
  }
});

router.post("/departments", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const department = await Department.create({ name, description });
    return res.status(201).json({
      department: mapDepartment(department),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Department already exists" });
    }
    return res.status(500).json({ message: "Failed to create department", error: error.message });
  }
});

router.put("/departments/:departmentId", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.departmentId,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    return res.json({
      department: mapDepartment(department),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Department already exists" });
    }
    return res.status(500).json({ message: "Failed to update department", error: error.message });
  }
});

router.patch("/departments/:departmentId/active", async (req, res) => {
  try {
    const isActive = Boolean(req.body.isActive);
    const department = await Department.findByIdAndUpdate(
      req.params.departmentId,
      { isActive },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    return res.json({
      department: mapDepartment(department),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update department status", error: error.message });
  }
});

router.delete("/departments/:departmentId", async (req, res) => {
  try {
    const doctorCount = await Doctor.countDocuments({ department: req.params.departmentId });
    if (doctorCount > 0) {
      return res.status(409).json({ message: "Cannot delete a department linked to doctors" });
    }

    const deleted = await Department.findByIdAndDelete(req.params.departmentId);
    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }

    return res.json({ message: "Department deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete department", error: error.message });
  }
});

router.get("/doctors", async (_req, res) => {
  try {
    const doctors = await Doctor.find({})
      .sort({ createdAt: -1 })
      .populate("department", "name")
      .populate("user", "email");

    return res.json({
      doctors: doctors.map((doctor) => ({
        ...mapDoctor(doctor),
        email: doctor.user?.email || "",
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch doctors", error: error.message });
  }
});

router.post("/doctors", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const fullName = String(req.body.fullName || "").trim();
    const specialty = String(req.body.specialty || "").trim();
    const qualification = String(req.body.qualification || "").trim();
    const experienceYears = Number(req.body.experienceYears || 0);
    const departmentId = req.body.departmentId || null;

    if (!email || password.length < 6 || !fullName || !specialty) {
      return res.status(400).json({ message: "Invalid doctor data" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await User.hashPassword(password);
    const doctorUser = await User.create({
      fullName,
      email,
      passwordHash,
      role: "doctor",
    });

    const doctor = await Doctor.create({
      user: doctorUser._id,
      department: departmentId || null,
      fullName,
      specialty,
      qualification,
      experienceYears,
    });

    const populatedDoctor = await doctor.populate("department", "name");
    return res.status(201).json({
      doctor: {
        ...mapDoctor(populatedDoctor),
        email: doctorUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create doctor", error: error.message });
  }
});

router.put("/doctors/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId).populate("user", "email fullName");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const fullName = String(req.body.fullName || doctor.fullName).trim();
    const specialty = String(req.body.specialty || doctor.specialty).trim();
    const qualification = String(req.body.qualification || "").trim();
    const experienceYears = Number(
      req.body.experienceYears !== undefined ? req.body.experienceYears : doctor.experienceYears
    );
    const departmentId = req.body.departmentId || null;

    doctor.fullName = fullName;
    doctor.specialty = specialty;
    doctor.qualification = qualification;
    doctor.experienceYears = Number.isNaN(experienceYears) ? 0 : experienceYears;
    doctor.department = departmentId;
    await doctor.save();

    if (doctor.user) {
      const user = await User.findById(doctor.user._id);
      if (user) {
        user.fullName = fullName;
        await user.save();
      }
    }

    await doctor.populate("department", "name");
    return res.json({
      doctor: {
        ...mapDoctor(doctor),
        email: doctor.user?.email || "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update doctor", error: error.message });
  }
});

router.patch("/doctors/:doctorId/active", async (req, res) => {
  try {
    const isActive = Boolean(req.body.isActive);
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      { isActive },
      { new: true }
    )
      .populate("department", "name")
      .populate("user", "email");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.json({
      doctor: {
        ...mapDoctor(doctor),
        email: doctor.user?.email || "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update doctor status", error: error.message });
  }
});

router.delete("/doctors/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const activeAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: { $in: ["pending", "accepted"] },
    });
    if (activeAppointments > 0) {
      return res.status(409).json({ message: "Doctor has active appointments and cannot be deleted" });
    }

    await Appointment.deleteMany({ doctor: doctor._id, status: { $in: ["rejected", "cancelled"] } });
    await Doctor.deleteOne({ _id: doctor._id });
    await User.deleteOne({ _id: doctor.user });

    return res.json({ message: "Doctor deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete doctor", error: error.message });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .populate("doctor", "fullName specialty")
      .populate("patient", "fullName email phone")
      .populate("department", "name");

    return res.json({
      appointments: appointments.map(mapAppointment),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
});

module.exports = router;
