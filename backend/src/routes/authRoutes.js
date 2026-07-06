const express = require("express");
const User = require("../models/User");
const { signAuthToken } = require("../utils/token");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!fullName || !email || password.length < 6) {
      return res.status(400).json({ message: "Invalid signup data" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role: "patient",
    });

    const token = signAuthToken(user);
    return res.status(201).json({
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to sign up", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signAuthToken(user);
    return res.json({
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login", error: error.message });
  }
});

router.get("/me", authRequired, async (req, res) => {
  return res.json({
    user: req.user.toSafeObject(),
  });
});

router.post("/bootstrap-admin", async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const fullName = String(req.body.fullName || "CareConnect Admin").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || password.length < 6) {
      return res.status(400).json({ message: "Invalid admin data" });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role: "admin",
    });

    const token = signAuthToken(user);
    return res.status(201).json({
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to bootstrap admin", error: error.message });
  }
});

router.post("/change-password", authRequired, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Invalid password data" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await user.comparePassword(currentPassword);
    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update password", error: error.message });
  }
});

module.exports = router;
