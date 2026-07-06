const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    qualification: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
      max: 80,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 4000,
    },
    avatarUrl: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
