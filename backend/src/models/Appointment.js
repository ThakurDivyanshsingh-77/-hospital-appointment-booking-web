const mongoose = require("mongoose");

const APPOINTMENT_STATUSES = ["pending", "accepted", "rejected", "cancelled"];

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
      index: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      default: "pending",
      index: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index(
  {
    doctor: 1,
    appointmentDate: 1,
    timeSlot: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "accepted"] },
    },
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
module.exports.APPOINTMENT_STATUSES = APPOINTMENT_STATUSES;
