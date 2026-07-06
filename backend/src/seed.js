const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const connectDb = require("./config/db");
const Department = require("./models/Department");
const User = require("./models/User");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");
const defaultDepartments = require("./data/defaultDepartments");

const seed = async () => {
  await connectDb();

  console.log("Seeding departments...");
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

  // Get list of departments
  const departments = await Department.find({});
  if (departments.length === 0) {
    console.error("No departments found to associate doctors with.");
    process.exit(1);
  }

  // Clear existing doctors, appointments, and patients to avoid duplications
  console.log("Cleaning up old doctors, patients, and appointments...");
  await Appointment.deleteMany({});
  
  // Find users who are doctors or patients and delete them, and delete doctor profiles
  const usersToDelete = await User.find({ role: { $in: ["doctor", "patient"] } });
  const userIds = usersToDelete.map(u => u._id);
  await Doctor.deleteMany({ user: { $in: userIds } });
  await User.deleteMany({ role: { $in: ["doctor", "patient"] } });

  console.log("Generating 10 doctors...");
  const passwordHash = await User.hashPassword("password123");
  const doctorsList = [];

  const doctorSpecs = [
    { name: "Dr. Arvind Sharma", specialty: "Cardiology", qual: "MD, DM (Cardiology)", exp: 12 },
    { name: "Dr. Sunita Rao", specialty: "Neurology", qual: "MD, DNB (Neurology)", exp: 10 },
    { name: "Dr. Rajesh Patel", specialty: "Orthopedics", qual: "MS (Orthopedics)", exp: 15 },
    { name: "Dr. Neha Gupta", specialty: "Pediatrics", qual: "MD (Pediatrics)", exp: 8 },
    { name: "Dr. Amit Verma", specialty: "General Medicine", qual: "MD (Medicine)", exp: 9 },
    { name: "Dr. Pooja Singh", specialty: "Ophthalmology", qual: "MS, FLVPEI (Ophthalmology)", exp: 11 },
    { name: "Dr. Vikram Malhotra", specialty: "Dermatology", qual: "MD (Dermatology)", exp: 7 },
    { name: "Dr. Shalini Joshi", specialty: "Emergency Medicine", qual: "MD (Emergency Medicine)", exp: 6 },
    { name: "Dr. Sanjay Dutt", specialty: "Cardiology", qual: "MD, DM (Cardiology)", exp: 20 },
    { name: "Dr. Meera Nair", specialty: "Neurology", qual: "MD, DM (Neurology)", exp: 14 }
  ];

  for (let i = 0; i < 10; i++) {
    const spec = doctorSpecs[i];
    const email = `doctor${i + 1}@careconnect.com`;
    
    const userDoc = await User.create({
      fullName: spec.name,
      email: email,
      passwordHash: passwordHash,
      role: "doctor",
      phone: `98765432${i.toString().padStart(2, '0')}`,
    });

    // Match department by name or use a random one
    let dept = departments.find(d => d.name.toLowerCase() === spec.specialty.toLowerCase());
    if (!dept) {
      dept = departments[i % departments.length];
    }

    const doctorProfile = await Doctor.create({
      user: userDoc._id,
      department: dept._id,
      fullName: spec.name,
      specialty: spec.specialty,
      qualification: spec.qual,
      experienceYears: spec.exp,
      bio: `Highly experienced specialist in ${spec.specialty} dedicated to patient care and clinical excellence.`,
      avatarUrl: `/src/assets/doctor-${(i % 3) + 1}.jpg`,
      isActive: true,
    });

    doctorsList.push(doctorProfile);
  }

  console.log("Generating 20 patients...");
  const patientsList = [];
  for (let i = 1; i <= 20; i++) {
    const patientUser = await User.create({
      fullName: `Patient Patient_${i}`,
      email: `patient${i}@careconnect.com`,
      passwordHash: passwordHash,
      role: "patient",
      phone: `99887766${i.toString().padStart(2, '0')}`,
    });
    patientsList.push(patientUser);
  }

  console.log("Generating 20 appointments for yesterday (previous day)...");
  // Calculate yesterday date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  const statuses = ["accepted", "pending", "rejected", "accepted"];

  // We want to create exactly 20 appointments.
  // We have 10 doctors. We will assign exactly 2 appointments per doctor.
  // Each doctor will get 2 distinct time slots.
  let appointmentCount = 0;
  for (let i = 0; i < 10; i++) {
    const doctor = doctorsList[i];
    
    // Choose two different slots
    const slot1 = timeSlots[i % timeSlots.length];
    const slot2 = timeSlots[(i + 4) % timeSlots.length];

    // Assign to Patient (i * 2) and Patient (i * 2 + 1)
    const patient1 = patientsList[i * 2];
    const patient2 = patientsList[i * 2 + 1];

    // Create first appointment
    await Appointment.create({
      patient: patient1._id,
      doctor: doctor._id,
      department: doctor.department,
      appointmentDate: yesterday,
      timeSlot: slot1,
      status: statuses[appointmentCount % statuses.length],
      notes: `Pre-booked follow-up consultation for patient ${i * 2 + 1}.`,
    });
    appointmentCount++;

    // Create second appointment
    await Appointment.create({
      patient: patient2._id,
      doctor: doctor._id,
      department: doctor.department,
      appointmentDate: yesterday,
      timeSlot: slot2,
      status: statuses[appointmentCount % statuses.length],
      notes: `Pre-booked check-up consultation for patient ${i * 2 + 2}.`,
    });
    appointmentCount++;
  }

  // Ensure/create Admin user
  const adminEmail = String(process.env.SEED_ADMIN_EMAIL || "admin@careconnect.com").trim().toLowerCase();
  const adminPassword = String(process.env.SEED_ADMIN_PASSWORD || "admin123");
  const adminName = String(process.env.SEED_ADMIN_NAME || "CareConnect Admin");
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const adminPasswordHash = await User.hashPassword(adminPassword);
    await User.create({
      fullName: adminName,
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "admin",
    });
    console.log(`Seeded admin user: ${adminEmail}`);
  }

  console.log(`Seed complete. Created 10 doctors, 20 patients, and ${appointmentCount} appointments for yesterday (${yesterday.toDateString()}).`);
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
