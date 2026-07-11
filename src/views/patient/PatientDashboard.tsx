import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PatientLayout from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  CalendarPlus,
  MapPin,
  Sparkles,
  ChevronRight,
  Sun,
  History,
  FileText,
  MessageSquare,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

interface UpcomingAppointment {
  id: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  doctor: { fullName: string; specialty: string } | null;
  department: { name: string } | null;
}

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 3, pending: 0, accepted: 2, rejected: 1 });
  const [upcoming, setUpcoming] = useState<UpcomingAppointment[]>([
    {
      id: "mock-1",
      appointmentDate: "Sun, Jul 6, 2026",
      timeSlot: "10:00 AM",
      status: "accepted",
      doctor: { fullName: "Divyansh Singh", specialty: "Cardiologist • Cardiology" },
      department: { name: "CareConnect Clinic" },
    },
  ]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiRequest<{ stats: Stats; upcoming: UpcomingAppointment[] }>("/patient/dashboard");
        if (response.stats) {
          setStats(response.stats);
        }
        if (response.upcoming && response.upcoming.length > 0) {
          // Normalize dates to match premium look if actual data is present
          setUpcoming(response.upcoming);
        }
      } catch (err) {
        // Fallback to mock data for presentation
      }
    };

    fetchDashboard().catch(() => {});
  }, []);

  const statCards = [
    {
      label: "Total Appointments",
      value: stats.total,
      sub: "All time",
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-50/70 border-blue-100",
      wavePath: "M0 25 C10 15, 30 15, 45 20 C60 25, 75 10, 100 22",
      waveColor: "stroke-blue-300",
    },
    {
      label: "Pending",
      value: stats.pending,
      sub: "Awaiting confirmation",
      icon: Clock,
      color: "text-sky-600 bg-sky-50/70 border-sky-100",
      wavePath: "M0 20 C20 30, 40 10, 60 25 C80 15, 90 28, 100 15",
      waveColor: "stroke-sky-300",
    },
    {
      label: "Accepted",
      value: stats.accepted,
      sub: "Confirmed",
      icon: CheckCircle,
      color: "text-blue-600 bg-blue-50/70 border-blue-100",
      wavePath: "M0 15 C15 15, 35 28, 55 12 C75 22, 85 24, 100 10",
      waveColor: "stroke-blue-300",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      sub: "Declined",
      icon: XCircle,
      color: "text-rose-600 bg-rose-50/70 border-rose-100",
      wavePath: "M0 28 C25 24, 45 8, 65 26 C85 20, 95 14, 100 5",
      waveColor: "stroke-rose-300",
    },
  ];

  const getFirstName = (name?: string) => {
    if (!name) return "there";
    return name.split(" ")[0];
  };

  return (
    <PatientLayout title="Overview" subtitle="Health journey dashboard">
      {/* Welcome Banner */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          Hello, {getFirstName(user?.fullName)}! <span className="animate-bounce">👋</span>
        </h2>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">Welcome back to your health dashboard</p>
        <p className="text-sm text-slate-500 mt-0.5">Here's your health overview and upcoming appointments</p>
      </div>

      {/* Stats Section */}
      <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <Card
            key={item.label}
            className="relative overflow-hidden flex flex-col justify-between border-slate-100 bg-white p-5 shadow-sm min-h-36 hover:shadow-md transition-all duration-300 group"
          >
            {/* Wave Background SVG */}
            <svg
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 w-full h-12 opacity-80 pointer-events-none"
            >
              <path
                d={item.wavePath}
                fill="none"
                className={`${item.waveColor} transition-all duration-500 group-hover:stroke-2`}
                strokeWidth="1.2"
              />
            </svg>

            <div className="flex justify-between items-start z-10">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 z-10">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{item.value}</p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">{item.label}</p>
              <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left/Middle Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments Card */}
          <Card className="border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <CalendarDays className="h-4 w-4" />
                </span>
                Upcoming Appointments
              </h3>
              <Link to="/patient/appointments">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-700 hover:bg-blue-50 gap-1">
                  View All <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-400 font-medium">No upcoming appointments scheduled.</p>
                <Link to="/patient/book" className="mt-3 inline-block">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Book Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 hover:border-slate-200 transition-all shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Doctor Details */}
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-md shadow-inner">
                          {appointment.doctor ? appointment.doctor.fullName.split(" ").map((n) => n[0]).join("") : "Dr"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base">{appointment.doctor?.fullName || "Dr. Divyansh Singh"}</p>
                          <p className="text-xs text-slate-500 font-medium">{appointment.doctor?.specialty || "Cardiology Specialist"}</p>
                          <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 uppercase">
                            Follow-up
                          </span>
                        </div>
                      </div>

                      {/* Schedule Details */}
                      <div className="space-y-2 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>{appointment.appointmentDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>{appointment.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>{appointment.department?.name || "CareConnect Clinic"}</span>
                        </div>
                      </div>

                      {/* Status and Action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                        <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                          {appointment.status}
                        </span>
                        <Link to="/patient/appointments">
                          <Button variant="outline" size="sm" className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Need a new appointment banner */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/10 p-5">
              <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100/55 text-indigo-800 shadow-sm shrink-0">
                  <CalendarPlus className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Need a new appointment?</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Book a consultation with our healthcare specialists</p>
                </div>
              </div>
              <Link to="/patient/book">
                <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm rounded-xl px-5 py-2.5 shadow-md shadow-indigo-500/15">
                  Book New Appointment
                </Button>
              </Link>
            </div>
          </Card>

          {/* Your Health at a Glance Card */}
          <Card className="border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 flex items-center gap-2 mb-6">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles className="h-4 w-4" />
              </span>
              Your Health at a Glance
            </h3>

            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Checkup</p>
                <p className="text-sm font-extrabold text-slate-800 mt-2">20 May 2026</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">1 month ago</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Appointment</p>
                <p className="text-sm font-extrabold text-slate-800 mt-2">6 Jul 2026</p>
                <p className="text-[10px] text-indigo-600 font-bold mt-0.5">In 5 days</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prescriptions</p>
                <p className="text-sm font-extrabold text-slate-800 mt-2">1 Active</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Current meds</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Score</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <p className="text-sm font-extrabold text-slate-900">85</p>
                  <p className="text-[10px] text-slate-400 font-bold">/ 100</p>
                </div>
                <p className="text-[10px] text-blue-600 font-bold mt-0.5">Good</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card className="border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 flex items-center gap-2 mb-6">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Sparkles className="h-4 w-4" />
              </span>
              Quick Actions
            </h3>

            <div className="grid gap-3 grid-cols-2">
              <Link to="/patient/book" className="block">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-4 text-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all group h-full flex flex-col items-center justify-center">
                  <CalendarPlus className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-blue-900 mt-2">Book Appointment</p>
                </div>
              </Link>

              <Link to="/patient/appointments" className="block">
                <div className="rounded-2xl border border-sky-100 bg-sky-50/20 p-4 text-center cursor-pointer hover:bg-sky-50/50 hover:border-sky-200 transition-all group h-full flex flex-col items-center justify-center">
                  <History className="h-5 w-5 text-sky-600 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-sky-900 mt-2">View History</p>
                </div>
              </Link>

              <Link to="/patient/records" className="block">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-4 text-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all group h-full flex flex-col items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-blue-900 mt-2">Health Records</p>
                </div>
              </Link>

              <Link to="/patient/messages" className="block">
                <div className="rounded-2xl border border-amber-100 bg-amber-50/20 p-4 text-center cursor-pointer hover:bg-amber-50/50 hover:border-amber-200 transition-all group h-full flex flex-col items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-amber-900 mt-2">Message Doctor</p>
                </div>
              </Link>
            </div>
          </Card>

          {/* Health Tip of the Day */}
          <Card className="border-slate-100 bg-white p-6 shadow-sm overflow-hidden relative">
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="text-xs font-bold text-amber-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sun className="h-4 w-4 text-amber-500 fill-amber-100" />
                  Health Tip of the Day
                </h3>
                <p className="text-sm font-medium text-slate-700 mt-3 leading-relaxed">
                  Drink plenty of water and get 7-8 hours of sleep for a healthy heart.
                </p>
                <Button variant="link" className="p-0 text-blue-700 hover:text-blue-900 text-xs font-bold gap-1 mt-4">
                  Learn More <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              {/* 3D Heart Illustration SVG Representation */}
              <div className="h-24 w-24 shrink-0 flex items-center justify-center bg-rose-50 rounded-2xl relative overflow-hidden self-center border border-rose-100 shadow-inner">
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                  {/* Outer shield glow */}
                  <circle cx="50" cy="50" r="38" fill="rgba(244, 63, 94, 0.08)" />
                  {/* Heart path */}
                  <path
                    d="M50 82C50 82 82 60 82 38C82 22 70 14 58 14C51 14 47 18 45 20C43 18 39 14 32 14C20 14 8 22 8 38C8 60 50 82 50 82Z"
                    fill="url(#heartGrad)"
                    filter="drop-shadow(0px 3px 6px rgba(225, 29, 72, 0.35))"
                  />
                  {/* Cross sign */}
                  <path
                    d="M44 32H56V44H68V56H56V68H44V56H32V44H44V32Z"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                  <defs>
                    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#be123c" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </Card>

          {/* Stay on top of your health */}
          <Card className="border-slate-100 bg-white p-6 shadow-sm overflow-hidden relative">
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="text-md font-extrabold text-slate-900 tracking-tight leading-tight">
                  Stay on top of your health
                </h3>
                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                  Regular check-ups help you stay healthy and prevent problems before they start.
                </p>
                <Link to="/patient/book">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1 rounded-xl px-4 py-2 shadow-md shadow-blue-500/10">
                    Schedule Now <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              {/* 3D Clipboard Illustration SVG Representation */}
              <div className="h-24 w-24 shrink-0 flex items-center justify-center bg-blue-50 rounded-2xl relative overflow-hidden self-center border border-blue-100 shadow-inner">
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                  <circle cx="50" cy="50" r="38" fill="rgba(37, 99, 235, 0.08)" />
                  {/* Clipboard */}
                  <rect x="25" y="20" width="50" height="66" rx="6" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
                  <path d="M40 16H60V22H40V16Z" fill="#3b82f6" rx="2" />
                  {/* Lines */}
                  <line x1="35" y1="34" x2="65" y2="34" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  <line x1="35" y1="44" x2="55" y2="44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  <line x1="35" y1="54" x2="60" y2="54" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  {/* Check badge */}
                  <circle cx="68" cy="72" r="16" fill="url(#blueBadgeGrad)" filter="drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))" />
                  <path d="M62 72L66 76L74 68" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <defs>
                    <linearGradient id="blueBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
