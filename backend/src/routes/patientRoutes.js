const fs = require("fs");
const path = require("path");
const express = require("express");
const Appointment = require("../models/Appointment");
const Department = require("../models/Department");
const Doctor = require("../models/Doctor");
const MedicalReport = require("../models/MedicalReport");
const { authRequired, requireRoles } = require("../middleware/auth");
const { uploadReport } = require("../middleware/upload");
const { mapAppointment, mapDepartment, mapDoctor, mapReport } = require("../utils/serializers");
const { toDateOnly, todayDateOnly } = require("../utils/date");

const router = express.Router();
const BACKEND_ROOT = path.resolve(__dirname, "../..");

router.use(authRequired, requireRoles("patient"));

const getOwnedAppointment = async (patientId, appointmentId) => {
  return Appointment.findOne({
    _id: appointmentId,
    patient: patientId,
  });
};

router.get("/dashboard", async (req, res) => {
  try {
    const [appointments, upcomingAppointments] = await Promise.all([
      Appointment.find({ patient: req.user._id }).populate("doctor", "fullName specialty").populate("department", "name"),
      Appointment.find({
        patient: req.user._id,
        appointmentDate: { $gte: todayDateOnly() },
        status: { $in: ["pending", "accepted"] },
      })
        .sort({ appointmentDate: 1 })
        .limit(5)
        .populate("doctor", "fullName specialty")
        .populate("department", "name"),
    ]);

    const stats = {
      total: appointments.length,
      pending: appointments.filter((item) => item.status === "pending").length,
      accepted: appointments.filter((item) => item.status === "accepted").length,
      rejected: appointments.filter((item) => item.status === "rejected").length,
    };

    return res.json({
      stats,
      upcoming: upcomingAppointments.map(mapAppointment),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch patient dashboard", error: error.message });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const filter = { patient: req.user._id };
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: -1, createdAt: -1 })
      .populate("doctor", "fullName specialty")
      .populate("department", "name");

    return res.json({
      appointments: appointments.map(mapAppointment),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch patient appointments", error: error.message });
  }
});

router.get("/book-meta", async (_req, res) => {
  try {
    const [departments, doctors] = await Promise.all([
      Department.find({ isActive: true }).sort({ name: 1 }),
      Doctor.find({ isActive: true })
        .sort({ fullName: 1 })
        .populate("department", "name")
        .populate("user", "_id"),
    ]);

    return res.json({
      departments: departments.map(mapDepartment),
      doctors: doctors.map(mapDoctor),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch booking metadata", error: error.message });
  }
});

router.get("/booked-slots", async (req, res) => {
  try {
    const doctorId = String(req.query.doctorId || "");
    const date = toDateOnly(req.query.date);
    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date are required" });
    }

    const booked = await Appointment.find({
      doctor: doctorId,
      appointmentDate: date,
      status: { $in: ["pending", "accepted"] },
    }).select("timeSlot");

    return res.json({
      bookedSlots: booked.map((item) => item.timeSlot),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch booked slots", error: error.message });
  }
});

router.post("/appointments", async (req, res) => {
  try {
    const doctorId = String(req.body.doctorId || "");
    const departmentId = req.body.departmentId || null;
    const appointmentDate = toDateOnly(req.body.appointmentDate);
    const timeSlot = String(req.body.timeSlot || "").trim();
    const notes = String(req.body.notes || "").trim();

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: "Invalid appointment data" });
    }

    const doctor = await Doctor.findOne({ _id: doctorId, isActive: true });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found or inactive" });
    }

    // Check for existing booking
    const existing = await Appointment.findOne({
      doctor: doctor._id,
      appointmentDate,
      timeSlot,
      status: { $in: ["pending", "accepted"] },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked."
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctor._id,
      department: departmentId || doctor.department || null,
      appointmentDate,
      timeSlot,
      notes,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "fullName specialty")
      .populate("department", "name");

    return res.status(201).json({
      appointment: mapAppointment(populated),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked."
      });
    }
    return res.status(500).json({ message: "Failed to create appointment", error: error.message });
  }
});

router.get("/appointments/:appointmentId/reports", async (req, res) => {
  try {
    const appointment = await getOwnedAppointment(req.user._id, req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const reports = await MedicalReport.find({ appointment: appointment._id }).sort({ createdAt: -1 });
    return res.json({
      reports: reports.map(mapReport),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reports", error: error.message });
  }
});

router.post("/appointments/:appointmentId/reports", (req, res, next) => {
  uploadReport.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload failed" });
    }
    return next();
  });
});

router.post("/appointments/:appointmentId/reports", async (req, res) => {
  try {
    const appointment = await getOwnedAppointment(req.user._id, req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.status !== "accepted") {
      return res.status(400).json({ message: "Reports can be uploaded only for accepted appointments" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const relativePath = path.relative(BACKEND_ROOT, req.file.path).replace(/\\/g, "/");
    const report = await MedicalReport.create({
      appointment: appointment._id,
      patient: req.user._id,
      fileName: req.file.originalname,
      filePath: relativePath,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    return res.status(201).json({
      report: mapReport(report),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload report", error: error.message });
  }
});

router.delete("/reports/:reportId", async (req, res) => {
  try {
    const report = await MedicalReport.findOne({
      _id: req.params.reportId,
      patient: req.user._id,
    });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await MedicalReport.deleteOne({ _id: report._id });

    const absoluteFilePath = path.join(BACKEND_ROOT, report.filePath);
    fs.promises.unlink(absoluteFilePath).catch(() => {});

    return res.json({ message: "Report deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete report", error: error.message });
  }
});

module.exports = router;
