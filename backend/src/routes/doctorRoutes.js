const express = require("express");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const MedicalReport = require("../models/MedicalReport");
const { authRequired, requireRoles } = require("../middleware/auth");
const { mapAppointment, mapReport } = require("../utils/serializers");
const { toDateOnly, todayDateOnly } = require("../utils/date");

const router = express.Router();

router.use(authRequired, requireRoles("doctor"));

const getDoctorByUserId = async (userId) => {
  return Doctor.findOne({ user: userId });
};

router.get("/profile", async (req, res) => {
  try {
    const doctor = await getDoctorByUserId(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    return res.json({
      id: doctor._id,
      fullName: doctor.fullName,
      specialty: doctor.specialty,
      avatarUrl: doctor.avatarUrl,
      experienceYears: doctor.experienceYears,
      qualification: doctor.qualification,
      bio: doctor.bio,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const doctor = await getDoctorByUserId(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const { fullName, specialty, qualification, experienceYears, bio, avatarUrl } = req.body;

    if (fullName) doctor.fullName = fullName;
    if (specialty) doctor.specialty = specialty;
    if (qualification !== undefined) doctor.qualification = qualification;
    if (experienceYears !== undefined) doctor.experienceYears = Number(experienceYears || 0);
    if (bio !== undefined) doctor.bio = bio;
    if (avatarUrl !== undefined) doctor.avatarUrl = avatarUrl;

    await doctor.save();
    return res.json({ message: "Profile updated successfully", doctor });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

router.get("/patients", async (req, res) => {
  try {
    const doctor = await getDoctorByUserId(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "fullName email phone createdAt")
      .sort({ appointmentDate: -1 });

    const patientsMap = new Map();
    for (const app of appointments) {
      if (!app.patient) continue;
      const pId = app.patient._id.toString();
      if (!patientsMap.has(pId)) {
        patientsMap.set(pId, {
          id: pId,
          fullName: app.patient.fullName,
          email: app.patient.email,
          phone: app.patient.phone || "N/A",
          appointmentCount: 0,
          lastAppointmentDate: app.appointmentDate,
          joinedDate: app.patient.createdAt,
        });
      }
      const entry = patientsMap.get(pId);
      entry.appointmentCount += 1;
    }

    return res.json({
      patients: Array.from(patientsMap.values()),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch patients", error: error.message });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const doctor = await getDoctorByUserId(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "fullName email phone")
      .populate("department", "name")
      .sort({ appointmentDate: 1 });

    const stats = {
      total: appointments.length,
      pending: appointments.filter((item) => item.status === "pending").length,
      accepted: appointments.filter((item) => item.status === "accepted").length,
      rejected: appointments.filter((item) => item.status === "rejected").length,
    };

    const today = todayDateOnly();
    const upcoming = appointments
      .filter((item) => item.appointmentDate >= today && !["rejected", "cancelled"].includes(item.status))
      .slice(0, 5)
      .map(mapAppointment);

    return res.json({
      doctorId: doctor._id.toString(),
      stats,
      upcoming,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch doctor dashboard", error: error.message });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const doctor = await getDoctorByUserId(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const filter = { doctor: doctor._id };
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: -1, createdAt: -1 })
      .populate("patient", "fullName email phone")
      .populate("department", "name");

    return res.json({
      appointments: appointments.map(mapAppointment),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch doctor appointments", error: error.message });
  }
});

router.patch("/appointments/:appointmentId/status", async (req, res) => {
  try {
    const status = String(req.body.status || "");
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status" });
    }

    const doctor = await getDoctorByUserId(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
      doctor: doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "fullName specialty")
      .populate("patient", "fullName email phone")
      .populate("department", "name");

    return res.json({
      appointment: mapAppointment(populated),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update appointment status", error: error.message });
  }
});

router.get("/availability", async (req, res) => {
  try {
    const date = toDateOnly(req.query.date);
    if (!date) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const doctor = await getDoctorByUserId(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const bookings = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: date,
      status: { $in: ["pending", "accepted"] },
    }).select("timeSlot");

    return res.json({
      bookedSlots: bookings.map((item) => item.timeSlot),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch availability", error: error.message });
  }
});

router.get("/appointments/:appointmentId/reports", async (req, res) => {
  try {
    const doctor = await getDoctorByUserId(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
      doctor: doctor._id,
    });
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

module.exports = router;
