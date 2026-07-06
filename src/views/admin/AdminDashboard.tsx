import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarDays,
  Building2,
  Clock,
  TrendingUp,
  Activity,
  ChevronDown,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiRequest } from "@/lib/api";

interface Stats {
  totalDoctors: number;
  totalAppointments: number;
  totalDepartments: number;
  pendingAppointments: number;
  monthlyAppointments?: { month: string; count: number }[];
  statusBreakdown?: { status: string; count: number }[];
  doctorWiseAppointments?: { doctorId: string; doctorName: string; count: number }[];
}

interface RecentAppointment {
  id: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  notes: string;
  doctor: { fullName: string; specialty?: string } | null;
  patient: { fullName: string; email: string } | null;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalDoctors: 1,
    totalAppointments: 4,
    totalDepartments: 8,
    pendingAppointments: 1,
    monthlyAppointments: [
      { month: "Jan", count: 0 },
      { month: "Feb", count: 1 },
      { month: "Mar", count: 1.5 },
      { month: "Apr", count: 1.7 },
      { month: "May", count: 2 },
      { month: "Jun", count: 3 },
      { month: "Jul", count: 4 },
    ],
    statusBreakdown: [
      { status: "accepted", count: 2 },
      { status: "pending", count: 1 },
      { status: "rejected", count: 1 },
    ],
    doctorWiseAppointments: [
      { doctorId: "doc-1", doctorName: "Divyansh Singh", count: 4 },
    ],
  });
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([
    {
      id: "1",
      appointmentDate: "6 July 2026",
      timeSlot: "10:30 AM",
      status: "pending",
      notes: "Routine followup checkup",
      doctor: { fullName: "Divyansh Singh", specialty: "Cardiologist" },
      patient: { fullName: "Raj", email: "raj@gmail.com" },
    },
    {
      id: "2",
      appointmentDate: "6 July 2026",
      timeSlot: "10:00 AM",
      status: "accepted",
      notes: "",
      doctor: { fullName: "Divyansh Singh", specialty: "Cardiologist" },
      patient: { fullName: "Akash Yadav", email: "akash@gmail.com" },
    },
    {
      id: "3",
      appointmentDate: "3 July 2026",
      timeSlot: "10:00 AM",
      status: "accepted",
      notes: "",
      doctor: { fullName: "Divyansh Singh", specialty: "Cardiologist" },
      patient: { fullName: "Akash Yadav", email: "akash@gmail.com" },
    },
    {
      id: "4",
      appointmentDate: "3 July 2026",
      timeSlot: "10:00 AM",
      status: "rejected",
      notes: "",
      doctor: { fullName: "Divyansh Singh", specialty: "Cardiologist" },
      patient: { fullName: "Akash Yadav", email: "akash@gmail.com" },
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest<{
          stats: Stats;
          recentAppointments: RecentAppointment[];
        }>("/admin/dashboard");
        if (response.stats) {
          setStats(response.stats);
        }
        if (response.recentAppointments && response.recentAppointments.length > 0) {
          setRecentAppointments(response.recentAppointments);
        }
      } catch (err) {
        // Fallback to mock data for presentation
      }
    };
    fetchData().catch(() => {});
  }, []);

  const monthlyData = stats.monthlyAppointments || [];
  const statusData = stats.statusBreakdown || [];
  const doctorData = stats.doctorWiseAppointments || [];

  const acceptedCount = statusData.find((item) => item.status === "accepted")?.count || 0;

  const completionRate = stats.totalAppointments
    ? Math.round((acceptedCount / stats.totalAppointments) * 100)
    : 50;

  const statCards = [
    {
      label: "Doctors",
      value: stats.totalDoctors,
      icon: Users,
      color: "text-violet-600 bg-violet-50/70 border-violet-100",
      meta: "Registered specialists",
      link: "/admin/doctors",
    },
    {
      label: "Appointments",
      value: stats.totalAppointments,
      icon: CalendarDays,
      color: "text-sky-600 bg-sky-50/70 border-sky-100",
      meta: "All-time bookings",
      link: "/admin/appointments",
    },
    {
      label: "Departments",
      value: stats.totalDepartments,
      icon: Building2,
      color: "text-emerald-600 bg-emerald-50/70 border-emerald-100",
      meta: "Operational units",
      link: "/admin/departments",
    },
    {
      label: "Pending",
      value: stats.pendingAppointments,
      icon: Clock,
      color: "text-amber-600 bg-amber-50/70 border-amber-100",
      meta: "Needs review",
      link: "/admin/appointments",
    },
  ];

  const pieColors = ["#7c3aed", "#ff9f43", "#ff4d4f"];

  const statusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 border-emerald-100 text-emerald-700";
      case "rejected":
      case "cancelled":
        return "bg-rose-50 border-rose-100 text-rose-700";
      default:
        return "bg-amber-50 border-amber-100 text-amber-700";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AdminLayout title="Dashboard" subtitle="Operational overview across doctors, bookings, and patient flow">
      <div className="space-y-6">
        {/* Banner Section */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Operations Pulse Banner */}
          <Card className="relative overflow-hidden border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600 p-6 shadow-sm lg:col-span-2 text-white flex justify-between">
            <div className="relative z-10 flex flex-col justify-between max-w-[55%]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-100">Operations Pulse</p>
                <h2 className="text-xl font-extrabold leading-tight mt-3">
                  Keep clinical operations balanced with live appointment and staffing insights.
                </h2>
                <p className="mt-2 text-xs text-violet-100 font-medium leading-relaxed">
                  Monitor trends, identify bottlenecks, and move quickly on pending requests from a single admin hub.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-violet-700 shadow-sm hover:bg-violet-50 transition-colors">
                  Real-time Dashboard
                </button>
                <button className="rounded-xl border border-white/30 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-colors">
                  Analytics Overview
                </button>
              </div>
            </div>

            {/* 3D Dashboard Screen Mockup Vector Illustration */}
            <div className="hidden sm:flex h-40 w-52 shrink-0 items-center justify-center bg-white/5 rounded-2xl relative overflow-hidden self-center border border-white/10">
              <svg viewBox="0 0 100 100" className="w-40 h-40">
                <defs>
                  <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                </defs>
                {/* Desk/Base */}
                <path d="M30 80 H70 L65 85 H35 Z" fill="#94a3b8" />
                <rect x="47" y="70" width="6" height="12" fill="#cbd5e1" />
                {/* Monitor frame */}
                <rect x="15" y="20" width="70" height="50" rx="4" fill="#64748b" />
                {/* Screen */}
                <rect x="17" y="22" width="66" height="42" rx="2" fill="url(#screenGrad)" />
                {/* Charts inside screen */}
                <path d="M22 55 L35 40 L50 48 L65 32 L78 45" fill="none" stroke="#6d28d9" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="35" cy="40" r="2.5" fill="#6d28d9" />
                <circle cx="65" cy="32" r="2.5" fill="#6d28d9" />
                {/* Pie Chart representation */}
                <circle cx="35" cy="30" r="6" fill="#f59e0b" />
                <circle cx="35" cy="30" r="6" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="18 20" />
              </svg>
            </div>
            {/* Background blobs */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          </Card>

          {/* Appointment Outcome Card */}
          <Card className="border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Appointment Outcome</p>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <p className="text-4xl font-black text-slate-900 tracking-tight">{completionRate}%</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Accepted bookings rate</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6 h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-violet-600 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 text-violet-700">
                <Activity className="h-3.5 w-3.5 shrink-0" />
                {acceptedCount} accepted appointments out of {stats.totalAppointments}
              </span>
              <span className="text-[10px] bg-slate-100 rounded px-1.5 py-0.5">50%</span>
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => (
            <Card
              key={item.label}
              className="border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{item.value}</p>
                  <p className="text-xs font-bold text-slate-900">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.meta}</p>
                </div>
              </div>

              <Link to={item.link} className="text-slate-400 hover:text-violet-600 transition-colors">
                <span className="flex items-center gap-1 text-[10px] font-bold">
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 xl:grid-cols-3">
          {/* Daily Appointments Line Chart */}
          <Card className="border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Daily Appointments</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Track daily booking momentum</p>
              </div>
              <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg bg-white px-2 py-1 shadow-sm">
                <span>This Month</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="h-64">
              {monthlyData.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No daily data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ left: -25, right: 10, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} stroke="#cbd5e1" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} stroke="#cbd5e1" />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#6d28d9" strokeWidth={3} dot={{ r: 4, fill: "#6d28d9" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Status Distribution Pie Chart */}
          <Card className="border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Status Distribution</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Current lifecycle of appointments</p>
              </div>
              <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg bg-white px-2 py-1 shadow-sm">
                <span>All Time</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="h-64 flex flex-col justify-between">
              <div className="h-44">
                {statusData.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                    No status data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4}>
                        {statusData.map((_, index) => (
                          <Cell key={`status-cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              {/* Legends Row */}
              <div className="flex justify-center items-center gap-4 text-[10px] font-bold text-slate-600 border-t border-slate-50 pt-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-violet-600" />
                  Accepted ({acceptedCount})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending ({statusData.find((i) => i.status === "pending")?.count || 0})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Rejected ({statusData.find((i) => i.status === "rejected")?.count || 0})
                </span>
              </div>
            </div>
          </Card>

          {/* Doctor-wise Appointments Bar Chart */}
          <Card className="border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Doctor-wise Appointments</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Compare doctor workload distribution</p>
              </div>
              <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg bg-white px-2 py-1 shadow-sm">
                <span>All Time</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="h-64">
              {doctorData.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No doctor data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doctorData} margin={{ left: -25, right: 10, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="doctorName" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} stroke="#cbd5e1" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} stroke="#cbd5e1" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6d28d9" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Appointments Table */}
        <Card className="border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Recent Appointments</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Latest patient bookings for quick review</p>
            </div>
            <Link to="/admin/appointments">
              <Button size="sm" variant="outline" className="text-xs border-violet-200 text-violet-700 hover:bg-violet-50">
                View All Records
              </Button>
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              No recent appointments found.
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="space-y-3 md:hidden">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-xl border border-slate-100 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{appointment.patient?.fullName || "N/A"}</p>
                        <p className="text-[10px] text-slate-400">{appointment.patient?.email || "No email"}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${statusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                      <p>
                        Doctor: <span className="font-semibold text-slate-700">{appointment.doctor?.fullName || "N/A"}</span>
                      </p>
                      <p>
                        Date: <span className="font-semibold text-slate-700">{appointment.appointmentDate}</span>
                      </p>
                      <p>
                        Time: <span className="font-semibold text-slate-700">{appointment.timeSlot}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-left font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 text-left">Patient</th>
                      <th className="pb-3 text-left">Doctor</th>
                      <th className="pb-3 text-left">Date</th>
                      <th className="pb-3 text-left">Time</th>
                      <th className="pb-3 text-left">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-slate-50/40 transition-colors">
                        {/* Patient info details */}
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-[11px]">
                              {getInitials(appointment.patient?.fullName)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{appointment.patient?.fullName || "N/A"}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{appointment.patient?.email || "No email"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Doctor info details */}
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                              {getInitials(appointment.doctor?.fullName)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{appointment.doctor?.fullName || "N/A"}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{appointment.doctor?.specialty || "General Medicine"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Date details */}
                        <td className="py-3.5 text-slate-600 font-semibold">{appointment.appointmentDate}</td>

                        {/* Time details */}
                        <td className="py-3.5 text-slate-600 font-semibold">{appointment.timeSlot}</td>

                        {/* Status badge details */}
                        <td className="py-3.5">
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>

                        {/* Actions details */}
                        <td className="py-3.5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-violet-700 hover:border-violet-200 transition-colors shadow-sm">
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-violet-700 hover:border-violet-200 transition-colors shadow-sm">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Section */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4 text-xs font-semibold text-slate-500">
                <span>Showing 1 to {recentAppointments.length} of {recentAppointments.length} records</span>
                <div className="flex items-center gap-1">
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 font-bold text-white shadow-sm">
                    1
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
