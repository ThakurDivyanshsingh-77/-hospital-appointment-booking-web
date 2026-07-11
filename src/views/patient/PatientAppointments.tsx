import { useEffect, useRef, useState } from "react";
import PatientLayout from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, FileText, Trash2, Loader2 } from "lucide-react";
import { apiDownload, apiRequest } from "@/lib/api";
import { FileUpload } from "@/components/application/file-upload/file-upload-base";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

interface Report {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface Appointment {
  id: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  notes: string;
  doctor: { fullName: string; specialty: string } | null;
  department: { name: string } | null;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [uploading, setUploading] = useState(false);

  // Track active uploads with progress/failure states
  const [activeUploads, setActiveUploads] = useState<Record<string, { name: string; size: number; type: string; progress: number; failed?: boolean }>>({});
  const fileObjectsRef = useRef<Record<string, File>>({});

  const fetchAppointments = async () => {
    const query = filter !== "all" ? `?status=${encodeURIComponent(filter)}` : "";
    const response = await apiRequest<{ appointments: Appointment[] }>(`/patient/appointments${query}`);
    setAppointments(response.appointments || []);
  };

  useEffect(() => {
    fetchAppointments().catch(() => toast.error("Failed to load appointments"));
  }, [filter]);

  const openReports = async (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setUploadOpen(true);
    try {
      const response = await apiRequest<{ reports: Report[] }>(`/patient/appointments/${appointmentId}/reports`);
      setReports(response.reports || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load reports"));
      setReports([]);
    }
  };

  const uploadSingleFile = (tempId: string, file: File) => {
    // Start mock progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + Math.floor(Math.random() * 15) + 5, 95);
      setActiveUploads((prev) => {
        if (!prev[tempId] || prev[tempId].progress >= 100) return prev;
        return {
          ...prev,
          [tempId]: { ...prev[tempId], progress }
        };
      });
    }, 150);

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    apiRequest(`/patient/appointments/${selectedAppointmentId}/reports`, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        clearInterval(interval);
        setActiveUploads((prev) => ({
          ...prev,
          [tempId]: { ...prev[tempId], progress: 100 }
        }));
        toast.success(`Uploaded: ${file.name}`);

        // Refresh database reports
        if (selectedAppointmentId) {
          openReports(selectedAppointmentId).catch(() => { });
        }

        // Cleanup temp item after a brief delay
        setTimeout(() => {
          setActiveUploads((prev) => {
            const copy = { ...prev };
            delete copy[tempId];
            return copy;
          });
          delete fileObjectsRef.current[tempId];
        }, 1500);
      })
      .catch(() => {
        clearInterval(interval);
        setActiveUploads((prev) => ({
          ...prev,
          [tempId]: { ...prev[tempId], progress: 0, failed: true }
        }));
        toast.error(`Upload failed: ${file.name}`);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleDropFiles = (files: FileList) => {
    if (!selectedAppointmentId) return;

    Array.from(files).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`Only PDF, JPEG, PNG, and WebP are allowed. Skipped: ${file.name}`);
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`File must be under 10MB. Skipped: ${file.name}`);
        return;
      }

      const tempId = Math.random().toString();
      fileObjectsRef.current[tempId] = file;

      setActiveUploads((prev) => ({
        ...prev,
        [tempId]: {
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
        }
      }));

      uploadSingleFile(tempId, file);
    });
  };

  const handleRetryFile = (tempId: string) => {
    const file = fileObjectsRef.current[tempId];
    if (!file) return;

    setActiveUploads((prev) => ({
      ...prev,
      [tempId]: { ...prev[tempId], progress: 0, failed: false }
    }));

    uploadSingleFile(tempId, file);
  };

  const handleDeleteActiveUpload = (tempId: string) => {
    setActiveUploads((prev) => {
      const copy = { ...prev };
      delete copy[tempId];
      return copy;
    });
    delete fileObjectsRef.current[tempId];
  };

  const deleteReport = async (report: Report) => {
    try {
      await apiRequest(`/patient/reports/${report.id}`, {
        method: "DELETE",
      });
      toast.success("Report deleted.");
      if (selectedAppointmentId) {
        await openReports(selectedAppointmentId);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete report"));
    }
  };

  const downloadReport = async (report: Report) => {
    try {
      const blob = await apiDownload(`/reports/${report.id}/download`);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 15000);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to open report"));
    }
  };

  const statusColor = (status: string) => {
    if (status === "accepted") return "border-blue-200 bg-blue-100 text-blue-700";
    if (status === "pending") return "border-blue-200 bg-blue-100 text-blue-700";
    return "border-destructive/20 bg-destructive/10 text-destructive";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <PatientLayout title="My Appointments" subtitle="Track all your appointment bookings">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">{appointments.length} appointments</p>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36 border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {appointments.length === 0 ? (
        <Card className="border-slate-200/80 bg-white/95 p-12 text-center shadow-sm">
          <p className="text-slate-500">No appointments found.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="border-slate-200/80 bg-white/95 p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className=" truncate w-48 font-semibold text-slate-900">{appointment.doctor?.fullName}</h3>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {appointment.doctor?.specialty} - {appointment.department?.name || "General"}
                  </p>
                  {appointment.notes && (
                    <p className="mt-2 text-sm text-slate-500">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{appointment.appointmentDate}</p>
                    <p className="text-sm text-blue-700">{appointment.timeSlot}</p>
                  </div>
                  {appointment.status === "accepted" && (
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => openReports(appointment.id)}>
                      <Upload className="mr-1.5 h-3.5 w-3.5" /> Reports
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Medical Reports</DialogTitle>
            <DialogDescription>Upload PDF or image files for this appointment.</DialogDescription>
          </DialogHeader>

          <FileUpload.Root>
            <FileUpload.DropZone
              isDisabled={uploading}
              onDropFiles={handleDropFiles}
            />

            <FileUpload.List>
              {/* Active / In-progress / Failed Uploads */}
              {Object.entries(activeUploads).map(([tempId, file]) => (
                <FileUpload.ListItemProgressBar
                  key={tempId}
                  id={tempId}
                  name={file.name}
                  type={file.type}
                  size={file.size}
                  progress={file.progress}
                  failed={file.failed}
                  onDelete={() => handleDeleteActiveUpload(tempId)}
                  onRetry={() => handleRetryFile(tempId)}
                />
              ))}

              {/* Already uploaded reports from database */}
              {reports.map((report) => (
                <FileUpload.ListItemProgressBar
                  key={report.id}
                  id={report.id}
                  name={report.fileName}
                  type={report.fileType}
                  size={report.fileSize}
                  progress={100}
                  onDelete={() => deleteReport(report)}
                  onRetry={() => { }}
                  onView={() => downloadReport(report)}
                />
              ))}

              {reports.length === 0 && Object.keys(activeUploads).length === 0 && (
                <p className="text-center text-sm text-slate-500 py-6">No reports uploaded yet.</p>
              )}
            </FileUpload.List>
          </FileUpload.Root>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
};

export default PatientAppointments;
