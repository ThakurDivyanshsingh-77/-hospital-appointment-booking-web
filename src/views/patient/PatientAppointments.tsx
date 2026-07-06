import { useEffect, useRef, useState } from "react";
import PatientLayout from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, FileText, Trash2, Loader2 } from "lucide-react";
import { apiDownload, apiRequest } from "@/lib/api";

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
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAppointmentId) {
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only PDF and image files (JPEG, PNG, WebP) are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("File size must be under 10MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiRequest(`/patient/appointments/${selectedAppointmentId}/reports`, {
        method: "POST",
        body: formData,
      });

      toast.success("Report uploaded successfully!");
      await openReports(selectedAppointmentId);
    } catch (error) {
      toast.error(getErrorMessage(error, "Upload failed"));
    } finally {
      setUploading(false);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
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
    if (status === "accepted") return "border-violet-200 bg-violet-100 text-violet-700";
    if (status === "pending") return "border-purple-200 bg-purple-100 text-purple-700";
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
                    <h3 className="font-semibold text-slate-900">{appointment.doctor?.fullName}</h3>
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
                    <p className="text-sm text-violet-700">{appointment.timeSlot}</p>
                  </div>
                  {appointment.status === "accepted" && (
                    <Button size="sm" variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50" onClick={() => openReports(appointment.id)}>
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

          <div className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-violet-300 bg-violet-50/60 p-6 transition hover:border-violet-500">
              {uploading ? <Loader2 className="h-8 w-8 animate-spin text-violet-600" /> : <Upload className="h-8 w-8 text-violet-600" />}
              <span className="text-sm font-medium text-slate-900">{uploading ? "Uploading..." : "Click to upload a file"}</span>
              <span className="text-xs text-slate-500">PDF, JPEG, PNG, WebP (max 10MB)</span>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>

            {reports.length === 0 ? (
              <p className="text-center text-sm text-slate-500">No reports uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-5 w-5 shrink-0 text-violet-600" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">{report.fileName}</p>
                        <p className="text-xs text-slate-500">
                          {formatSize(report.fileSize)} - {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => downloadReport(report)}>
                        View
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteReport(report)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
};

export default PatientAppointments;
