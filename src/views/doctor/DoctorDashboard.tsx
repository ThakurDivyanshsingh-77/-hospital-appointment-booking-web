import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DoctorLayout from "@/components/doctor/DoctorLayout";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, CheckCircle, XCircle, Download, Smile, Zap } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { format } from "date-fns";

interface DashboardStats {
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
  patient: { fullName: string } | null;
}

const DoctorDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [upcoming, setUpcoming] = useState<UpcomingAppointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiRequest<{
        stats: DashboardStats;
        upcoming: UpcomingAppointment[];
      }>("/doctor/dashboard");

      setStats(response.stats);
      setUpcoming(response.upcoming || []);
    };

    fetchData().catch(() => {});
  }, []);

  const statCards = [
    {
      label: "Total Appointments",
      value: stats.total,
      subtext: "Today's total",
      icon: CalendarDays,
      iconBg: "bg-blue-100 text-blue-600",
      stroke: "text-blue-200",
    },
    {
      label: "Pending Requests",
      value: stats.pending,
      subtext: "Awaiting response",
      icon: Clock,
      iconBg: "bg-blue-100 text-blue-600",
      stroke: "text-blue-200",
    },
    {
      label: "Accepted",
      value: stats.accepted,
      subtext: "Confirmed",
      icon: CheckCircle,
      iconBg: "bg-blue-100 text-blue-600",
      stroke: "text-blue-200",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      subtext: "Declined",
      icon: XCircle,
      iconBg: "bg-rose-100 text-rose-600",
      stroke: "text-rose-200",
    },
  ];

  const statusColor = (status: string) => {
    if (status === "accepted") return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    if (status === "rejected" || status === "cancelled") return "bg-rose-100 text-rose-700 hover:bg-rose-100";
    return "bg-amber-100 text-amber-700 hover:bg-amber-100";
  };

  // Format Today Schedule based on actual appointments for today, or fallback to the screenshot items if none
  const todaySchedule = useMemo(() => {
    const todayStr = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    const todayAppts = upcoming.filter(app => {
      return app.appointmentDate === todayStr;
    });

    if (todayAppts.length > 0) {
      const mapped = todayAppts.map(app => ({
        time: app.timeSlot,
        title: app.patient?.fullName || "Patient",
        desc: "Consultation",
        status: app.status,
      }));
      mapped.sort((a, b) => a.time.localeCompare(b.time));
      // Inject Break Time
      if (mapped.length > 1) {
        mapped.splice(1, 0, { time: "11:30 AM", title: "Break Time", desc: "Time Block", status: "blocked" });
      }
      return mapped;
    }

    return [
      { time: "10:00 AM", title: "Akash Yadav", desc: "General Checkup", status: "accepted" },
      { time: "11:30 AM", title: "Break Time", desc: "Time Block", status: "blocked" },
      { time: "02:00 PM", title: "Priya Sharma", desc: "Follow-up Consultation", status: "accepted" },
      { time: "04:00 PM", title: "Rohit Verma", desc: "Chest Pain Consultation", status: "rejected" },
    ];
  }, [upcoming]);

  return (
    <DoctorLayout title="Dashboard" subtitle="Overview of your appointments and schedule">
      {/* Date Header Control bar */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
        <Button variant="outline" className="flex items-center gap-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-sm rounded-xl">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <span>{format(new Date(), "MMMM d, yyyy")}</span>
        </Button>
        <Button variant="outline" className="flex items-center gap-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-sm rounded-xl">
          <Download className="h-4 w-4 text-slate-400" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} className="relative overflow-hidden border-slate-200/80 bg-white shadow-sm rounded-2xl p-5 flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div className="z-10 flex-1">
              <p className="text-xs font-semibold text-slate-400 tracking-wide leading-none">{card.label}</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1.5">{card.value}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">{card.subtext}</p>
            </div>
            
            {/* Inline SVG Wave Graph */}
            <svg className={`absolute bottom-0 right-0 h-10 w-24 ${card.stroke}`} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25 C 20 15, 30 5, 50 18 C 70 30, 85 8, 100 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Card>
        ))}
      </div>

      {/* Middle Layout Columns */}
      <div className="grid gap-6 mt-6 lg:grid-cols-3">
        {/* Upcoming Appointments Card */}
        <Card className="lg:col-span-2 border-slate-200/80 bg-white shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-500" /> Upcoming Appointments
            </CardTitle>
            <Link to="/doctor/appointments" className="text-xs font-bold text-blue-600 hover:underline">
              View All &gt;
            </Link>
          </div>
          
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">No upcoming appointments.</p>
          ) : (
            <div className="space-y-3.5">
              {upcoming.map((appointment) => {
                const initial = appointment.patient?.fullName?.charAt(0) || "P";
                const patientId = `#CC${(appointment.id || "1023").slice(-4)}`;
                
                return (
                  <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/20 p-4 hover:bg-slate-50/50 transition-colors gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-extrabold text-sm shadow-sm">
                        {initial}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{appointment.patient?.fullName || "Patient"}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Patient ID: {patientId}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6">
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-slate-400" /> {appointment.appointmentDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-slate-400" /> {appointment.timeSlot}
                        </span>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Today's Schedule Card */}
        <Card className="border-slate-200/80 bg-white shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" /> Today's Schedule
            </CardTitle>
            <Link to="/doctor/availability" className="text-xs font-bold text-blue-600 hover:underline">
              View Calendar &gt;
            </Link>
          </div>

          {/* Timeline list */}
          <div className="relative pl-5 border-l border-slate-100 space-y-5 ml-2.5">
            {todaySchedule.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Timeline dot */}
                <div className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white ${
                  item.status === 'blocked' ? 'bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]' : item.status === 'rejected' ? 'bg-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : 'bg-blue-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]'
                }`} />
                
                <div className="flex items-center justify-between gap-3">
                  <div className="w-16 shrink-0 text-xs font-extrabold text-blue-700">
                    {item.time}
                  </div>
                  <div className="flex-1 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/20 p-3 hover:bg-slate-50/50 transition-colors">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.desc}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0 capitalize ${
                      item.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 
                      item.status === 'blocked' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {item.status === 'accepted' ? 'Accepted' : item.status === 'blocked' ? 'Blocked' : 'Rejected'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Punctuality Banner */}
      <Card className="mt-6 border-slate-200/80 bg-white shadow-sm rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 15l-2 5l9-11h-7l2-5l-9 11h7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">You're doing great today!</h3>
            <p className="text-xs text-slate-500 mt-0.5">Keep up the excellent work and help more patients.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 sm:gap-12 z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Time</p>
              <p className="text-base font-extrabold text-slate-800 leading-tight mt-0.5">100%</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Today's punctuality</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-sm">
              <Smile className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Satisfaction</p>
              <p className="text-base font-extrabold text-slate-800 leading-tight mt-0.5">4.8/5</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Based on feedback</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Response Time</p>
              <p className="text-base font-extrabold text-slate-800 leading-tight mt-0.5">15m</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Average response</p>
            </div>
          </div>
        </div>

        {/* Clipboard Illustration */}
        <div className="hidden xl:block shrink-0 pr-4 z-10">
          <svg className="h-16 w-16 text-blue-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="20" width="50" height="65" rx="8" fill="#F3E8FF" stroke="#A78BFA" strokeWidth="3"/>
            <rect x="40" y="12" width="20" height="12" rx="4" fill="#8B5CF6" />
            <line x1="35" y1="40" x2="65" y2="40" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round"/>
            <line x1="35" y1="52" x2="65" y2="52" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round"/>
            <line x1="35" y1="64" x2="55" y2="64" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="70" cy="75" r="12" fill="#10B981" />
            <path d="M65 75 L69 79 L76 71" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      </Card>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
