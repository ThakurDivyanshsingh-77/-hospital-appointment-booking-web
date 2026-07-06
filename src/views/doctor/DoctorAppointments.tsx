import { useEffect, useState } from "react";
import DoctorLayout from "@/components/doctor/DoctorLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye, FileText } from "lucide-react";
import { apiDownload, apiRequest } from "@/lib/api";

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
  createdAt: string;
  patient: { fullName: string; email: string; phone?: string } | null;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  const fetchAppointments = async () => {
    const query = filter !== "all" ? `?status=${encodeURIComponent(filter)}` : "";
    const response = await apiRequest<{ appointments: Appointment[] }>(`/doctor/appointments${query}`);
    setAppointments(response.appointments || []);
  };

  useEffect(() => {
    fetchAppointments().catch(() => toast.error("Failed to load appointments"));
  }, [filter]);

  const openDetail = async (appointment: Appointment) => {
    setSelected(appointment);
    setDetailOpen(true);

    if (appointment.status !== "accepted") {
      setReports([]);
      return;
    }

    try {
      const response = await apiRequest<{ reports: Report[] }>(`/doctor/appointments/${appointment.id}/reports`);
      setReports(response.reports || []);
    } catch {
      setReports([]);
    }
  };

  const viewReport = async (report: Report) => {
    try {
      const blob = await apiDownload(`/reports/${report.id}/download`);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 15000);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to open report"));
    }
  };

  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      await apiRequest(`/doctor/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Appointment ${status}`);
      fetchAppointments().catch(() => toast.error("Failed to refresh appointments"));
      setDetailOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update status"));
    }
  };

  const statusColor = (status: string) => {
    if (status === "accepted") return "bg-violet-100 text-violet-700";
    if (status === "rejected" || status === "cancelled") return "bg-destructive/10 text-destructive";
    return "bg-purple-100 text-purple-700";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DoctorLayout title="My Appointments" subtitle="Manage your appointment requests">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">{appointments.length} appointments</p>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden border-slate-200/80 bg-white/95 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-left text-xs uppercase text-slate-500">
                <th className="p-4">Patient</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50/70">
                    <td className="p-4">
                      <p className="font-medium text-slate-900">{appointment.patient?.fullName || "N/A"}</p>
                      <p className="text-xs text-slate-500">{appointment.patient?.email}</p>
                    </td>
                    <td className="p-4 text-slate-600">{appointment.appointmentDate}</td>
                    <td className="p-4 text-slate-600">{appointment.timeSlot}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openDetail(appointment)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {appointment.status === "pending" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-violet-600 hover:bg-violet-50"
                              onClick={() => updateStatus(appointment.id, "accepted")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => updateStatus(appointment.id, "rejected")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Review patient information and medical reports.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Patient</p>
                  <p className="font-medium text-slate-900">{selected.patient?.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-slate-900">{selected.patient?.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium text-slate-900">{selected.patient?.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor(selected.status)}`}>
                    {selected.status}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium text-slate-900">{selected.appointmentDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time Slot</p>
                  <p className="font-medium text-slate-900">{selected.timeSlot}</p>
                </div>
              </div>

              {selected.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="mt-1 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{selected.notes}</p>
                </div>
              )}

              {selected.status === "accepted" && (
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-900">Medical Reports ({reports.length})</p>
                  {reports.length === 0 ? (
                    <p className="rounded-md bg-slate-50 p-3 text-center text-sm text-slate-500">
                      No reports uploaded by patient.
                    </p>
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
                          <Button size="sm" variant="ghost" onClick={() => viewReport(report)}>
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selected.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                    onClick={() => updateStatus(selected.id, "accepted")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Accept
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => updateStatus(selected.id, "rejected")}>
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DoctorLayout>
  );
};

export default DoctorAppointments;
