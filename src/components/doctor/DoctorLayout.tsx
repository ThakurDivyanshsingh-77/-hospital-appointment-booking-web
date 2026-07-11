import { ReactNode, useMemo, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { Stethoscope, Bell, ChevronDown } from "lucide-react";
import DoctorSidebar from "./DoctorSidebar";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";

interface DoctorLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const routeNames: Record<string, string> = {
  "/doctor": "Dashboard",
  "/doctor/appointments": "Appointments",
  "/doctor/availability": "Availability",
  "/doctor/patients": "Patients",
  "/doctor/profile": "Profile",
  "/doctor/settings": "Settings",
};

const DoctorLayout = ({ children, title, subtitle }: DoctorLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const sectionName = useMemo(() => routeNames[location.pathname] || "Doctor", [location.pathname]);
  const [profile, setProfile] = useState<{ fullName: string; specialty: string } | null>(null);

  useEffect(() => {
    apiRequest<{ fullName: string; specialty: string }>("/doctor/profile")
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  const doctorName = useMemo(() => {
    if (!profile) return "Doctor";
    return profile.fullName.startsWith("Dr.") ? profile.fullName : `Dr. ${profile.fullName}`;
  }, [profile]);

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full overflow-hidden bg-slate-100">
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <DoctorSidebar />

        <div className="relative flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex min-h-[70px] items-center gap-3 py-3">
              <SidebarTrigger className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" />
              
              <div className="min-w-0 flex-1">
                {title === "Dashboard" ? (
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Welcome back, {doctorName} 👋</p>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mt-0.5">{title}</h1>
                    {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">CareConnect Doctor</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <h1 className="truncate text-lg font-bold text-slate-900">{title}</h1>
                      <Badge variant="secondary" className="rounded-md bg-blue-100 text-blue-700">
                        {sectionName}
                      </Badge>
                    </div>
                    {subtitle && <p className="truncate text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Notification Bell with Badge */}
                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                    3
                  </span>
                </button>

                {/* Profile Card / Dropdown */}
                {profile && (
                  <div className="hidden items-center gap-2.5 rounded-xl border border-slate-200 bg-white pl-2.5 pr-3 py-1.5 shadow-sm sm:flex">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">
                      {profile.fullName.charAt(0)}
                    </div>
                    <div className="text-left leading-none">
                      <p className="text-xs font-bold text-slate-800">
                        {profile.fullName.startsWith("Dr.") ? profile.fullName : `Dr. ${profile.fullName}`}
                      </p>
                      <p className="text-[9px] text-slate-500 font-medium mt-0.5">{profile.specialty}</p>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="relative flex-1 overflow-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DoctorLayout;
