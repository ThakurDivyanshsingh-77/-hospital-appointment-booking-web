const path = require("path");
const express = require("express");
const MedicalReport = require("../models/MedicalReport");
const { authRequired } = require("../middleware/auth");

const router = express.Router();
const BACKEND_ROOT = path.resolve(__dirname, "../..");

router.use(authRequired);

router.get("/:reportId/download", async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.reportId).populate({
      path: "appointment",
      populate: {
        path: "doctor",
        select: "user",
      },
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const canAccess =
      req.user.role === "admin" ||
      (req.user.role === "patient" && report.patient.toString() === req.user._id.toString()) ||
      (req.user.role === "doctor" &&
        report.appointment &&
        report.appointment.doctor &&
        report.appointment.doctor.user &&
        report.appointment.doctor.user.toString() === req.user._id.toString());

    if (!canAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const absolutePath = path.join(BACKEND_ROOT, report.filePath);
    return res.download(absolutePath, report.fileName);
  } catch (error) {
    return res.status(500).json({ message: "Failed to download report", error: error.message });
  }
});

module.exports = router;
