const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const connectDb = require("./config/db");
const Department = require("./models/Department");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const reportRoutes = require("./routes/reportRoutes");
const defaultDepartments = require("./data/defaultDepartments");

const app = express();
const port = Number(process.env.PORT || 5000);
const BACKEND_ROOT = path.resolve(__dirname, "..");
const DEFAULT_ALLOWED_ORIGINS = [
  "https://careconnectff.netlify.app",
  "https://agent-6a520be081a681ca06ee310c--careconnectff.netlify.app",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

const parseAllowedOrigins = () => {
  const raw = String(process.env.CLIENT_URL || "").trim();
  const envOrigins = raw.split(",").map((item) => item.trim()).filter(Boolean);
  return Array.from(new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins]));
};

app.use(
  cors({
    origin: parseAllowedOrigins(),
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const ensureDefaultData = async () => {
  for (const item of defaultDepartments) {
    await Department.updateOne(
      { name: item.name },
      {
        $setOnInsert: {
          name: item.name,
          description: item.description,
          icon: item.icon,
          isActive: true,
        },
      },
      { upsert: true }
    );
  }

  const adminEmail = String(process.env.SEED_ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = String(process.env.SEED_ADMIN_PASSWORD || "");
  const adminName = String(process.env.SEED_ADMIN_NAME || "CareConnect Admin");

  if (adminEmail && adminPassword.length >= 6) {
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const passwordHash = await User.hashPassword(adminPassword);
      await User.create({
        fullName: adminName,
        email: adminEmail,
        passwordHash,
        role: "admin",
      });
      console.log(`Created default admin user: ${adminEmail}`);
    }
  }
};

app.get("/api/health", (_req, res) => {
  return res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/reports", reportRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

const start = async () => {
  await connectDb();

  const uploadRoot = path.join(BACKEND_ROOT, "uploads");
  fs.mkdirSync(uploadRoot, { recursive: true });

  await ensureDefaultData();

  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
