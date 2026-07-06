const { toDateOnlyString } = require("./date");

const mapDepartment = (department) => {
  if (!department) {
    return null;
  }
  return {
    id: department._id.toString(),
    name: department.name,
    description: department.description || "",
    icon: department.icon || "Stethoscope",
    isActive: Boolean(department.isActive),
    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
  };
};

const mapDoctor = (doctor) => {
  if (!doctor) {
    return null;
  }
  return {
    id: doctor._id.toString(),
    userId: doctor.user?._id ? doctor.user._id.toString() : doctor.user?.toString(),
    fullName: doctor.fullName,
    specialty: doctor.specialty,
    qualification: doctor.qualification || "",
    experienceYears: doctor.experienceYears || 0,
    bio: doctor.bio || "",
    avatarUrl: doctor.avatarUrl || "",
    isActive: Boolean(doctor.isActive),
    departmentId: doctor.department?._id
      ? doctor.department._id.toString()
      : doctor.department?.toString() || null,
    department: doctor.department?._id
      ? {
          id: doctor.department._id.toString(),
          name: doctor.department.name,
        }
      : null,
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
  };
};

const mapAppointment = (appointment) => {
  if (!appointment) {
    return null;
  }
  return {
    id: appointment._id.toString(),
    appointmentDate: toDateOnlyString(appointment.appointmentDate),
    timeSlot: appointment.timeSlot,
    status: appointment.status,
    notes: appointment.notes || "",
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
    doctorId: appointment.doctor?._id ? appointment.doctor._id.toString() : appointment.doctor?.toString(),
    patientId: appointment.patient?._id ? appointment.patient._id.toString() : appointment.patient?.toString(),
    departmentId: appointment.department?._id
      ? appointment.department._id.toString()
      : appointment.department?.toString() || null,
    doctor: appointment.doctor?._id
      ? {
          id: appointment.doctor._id.toString(),
          fullName: appointment.doctor.fullName,
          specialty: appointment.doctor.specialty,
        }
      : null,
    patient: appointment.patient?._id
      ? {
          id: appointment.patient._id.toString(),
          fullName: appointment.patient.fullName,
          email: appointment.patient.email,
          phone: appointment.patient.phone || "",
        }
      : null,
    department: appointment.department?._id
      ? {
          id: appointment.department._id.toString(),
          name: appointment.department.name,
        }
      : null,
  };
};

const mapReport = (report) => {
  if (!report) {
    return null;
  }
  return {
    id: report._id.toString(),
    appointmentId: report.appointment?._id
      ? report.appointment._id.toString()
      : report.appointment.toString(),
    patientId: report.patient?._id
      ? report.patient._id.toString()
      : report.patient.toString(),
    fileName: report.fileName,
    filePath: report.filePath,
    fileType: report.fileType,
    fileSize: report.fileSize,
    createdAt: report.createdAt,
  };
};

const mapGalleryItem = (galleryItem) => {
  if (!galleryItem) {
    return null;
  }

  return {
    id: galleryItem._id.toString(),
    title: galleryItem.title,
    description: galleryItem.description || "",
    fileName: galleryItem.fileName,
    fileType: galleryItem.fileType,
    fileSize: galleryItem.fileSize,
    isActive: Boolean(galleryItem.isActive),
    uploadedBy: galleryItem.uploadedBy?._id
      ? {
          id: galleryItem.uploadedBy._id.toString(),
          fullName: galleryItem.uploadedBy.fullName,
          email: galleryItem.uploadedBy.email,
        }
      : galleryItem.uploadedBy
        ? { id: galleryItem.uploadedBy.toString() }
        : null,
    createdAt: galleryItem.createdAt,
    updatedAt: galleryItem.updatedAt,
  };
};

module.exports = {
  mapDepartment,
  mapDoctor,
  mapAppointment,
  mapReport,
  mapGalleryItem,
};
