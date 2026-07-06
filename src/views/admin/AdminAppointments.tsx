import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Appointment {
  id: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  notes: string;
  createdAt: string;
  doctor: { fullName: string } | null;
  patient: { fullName: string; email: string } | null;
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const fetchAppointments = useCallback(async () => {
    const statusPart = filter !== "all" ? `?status=${encodeURIComponent(filter)}` : "";
    const response = await apiRequest<{ appointments: Appointment[] }>(`/admin/appointments${statusPart}`);
    setAppointments(response.appointments || []);
  }, [filter]);

  useEffect(() => {
    fetchAppointments().catch(() => {});
  }, [fetchAppointments]);

  const statusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-violet-100 text-violet-700";
      case "rejected":
      case "cancelled":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-purple-100 text-purple-700";
    }
  };

  const filteredAppointments = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return appointments;
    }

    return appointments.filter((appointment) => {
      return (
        (appointment.patient?.fullName || "").toLowerCase().includes(search) ||
        (appointment.patient?.email || "").toLowerCase().includes(search) ||
        (appointment.doctor?.fullName || "").toLowerCase().includes(search) ||
        (appointment.notes || "").toLowerCase().includes(search) ||
        appointment.timeSlot.toLowerCase().includes(search) ||
        appointment.appointmentDate.toLowerCase().includes(search)
      );
    });
  }, [appointments, query]);

  const counts = useMemo(() => {
    const initial = { all: appointments.length, pending: 0, accepted: 0, rejected: 0, cancelled: 0 };
    for (const appointment of appointments) {
      const key = appointment.status as keyof typeof initial;
      if (key in initial) {
        initial[key] += 1;
      }
    }
    return initial;
  }, [appointments]);

  return (
    <AdminLayout title="Appointments" subtitle="Monitor and filter bookings across all departments">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Total</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{counts.all}</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-purple-700">{counts.pending}</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Accepted</p>
            <p className="mt-2 text-2xl font-bold text-violet-700">{counts.accepted}</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Rejected</p>
            <p className="mt-2 text-2xl font-bold text-rose-700">{counts.rejected}</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Cancelled</p>
            <p className="mt-2 text-2xl font-bold text-slate-700">{counts.cancelled}</p>
          </Card>
        </div>

        <Card className="border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr,220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search patient, doctor, date, notes..."
                className="h-10 border-slate-200 pl-9"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="h-10 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="overflow-hidden border-slate-200/80 bg-white/90 shadow-sm">
          <div className="border-b border-slate-200 px-5 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Booking List</p>
              <Badge variant="secondary" className="rounded-md bg-slate-100 text-slate-600">
                {filteredAppointments.length} records
              </Badge>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No appointments found for this filter.</div>
          ) : (
            <>
              <div className="space-y-3 p-4 md:hidden">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{appointment.patient?.fullName || "N/A"}</p>
                        <p className="text-xs text-slate-500">{appointment.patient?.email || "No email"}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${statusColor(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <p className="text-slate-500">
                        Doctor: <span className="font-medium text-slate-700">{appointment.doctor?.fullName || "N/A"}</span>
                      </p>
                      <p className="text-slate-500">
                        Time: <span className="font-medium text-slate-700">{appointment.timeSlot}</span>
                      </p>
                      <p className="col-span-2 text-slate-500">
                        Date: <span className="font-medium text-slate-700">{appointment.appointmentDate}</span>
                      </p>
                      {appointment.notes && (
                        <p className="col-span-2 text-slate-500">
                          Notes: <span className="font-medium text-slate-700">{appointment.notes}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="p-4">Patient</th>
                      <th className="p-4">Doctor</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-slate-50/70">
                        <td className="p-4">
                          <p className="font-medium text-slate-900">{appointment.patient?.fullName || "N/A"}</p>
                          <p className="text-xs text-slate-500">{appointment.patient?.email || "No email"}</p>
                        </td>
                        <td className="p-4 text-slate-600">{appointment.doctor?.fullName || "N/A"}</td>
                        <td className="p-4 text-slate-600">{appointment.appointmentDate}</td>
                        <td className="p-4 text-slate-600">{appointment.timeSlot}</td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusColor(appointment.status)}`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td className="max-w-[260px] truncate p-4 text-slate-600">{appointment.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;
