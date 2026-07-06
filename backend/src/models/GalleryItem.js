const mongoose = require("mongoose");

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    filePath: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GalleryItem", galleryItemSchema);
