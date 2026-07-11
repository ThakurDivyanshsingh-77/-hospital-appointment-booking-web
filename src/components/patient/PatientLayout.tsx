import { ReactNode, useMemo } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import PatientSidebar from "./PatientSidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PatientLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const routeNames: Record<string, string> = {
  "/patient": "Overview",
  "/patient/book": "Book Appointment",
  "/patient/appointments": "My Appointments",
  "/patient/records": "Health Records",
  "/patient/prescriptions": "Prescriptions",
  "/patient/messages": "Messages",
  "/patient/profile": "Profile",
  "/patient/settings": "Settings",
};

const PatientLayout = ({ children, title, subtitle }: PatientLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const sectionName = useMemo(() => routeNames[location.pathname] || "Patient", [location.pathname]);

  const getInitials = (name?: string) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full overflow-hidden bg-slate-50">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -left-20 -top-24 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-24 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />

        <PatientSidebar />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 bg-white/80 px-6 py-4 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors" />
              <div className="min-w-0">
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  CareConnect Patient
                </span>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900">{sectionName}</h1>
                  <span className="rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                  3
                </span>
              </button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-sm hover:bg-slate-50 transition-all">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm">
                      {getInitials(user?.fullName)}
                    </div>
                    <div className="hidden md:block pr-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900">{user?.fullName || "Akash Yadav"}</p>
                        <span className="rounded bg-blue-100 px-1 py-0.5 text-[9px] font-bold text-blue-700 uppercase">
                          Patient
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{user?.email || "akash@gmail.com"}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-100">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-slate-450 uppercase tracking-wider">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm focus:bg-blue-50 focus:text-blue-900 cursor-pointer">
                    <Link to="/patient/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm focus:bg-blue-50 focus:text-blue-900 cursor-pointer">
                    <Link to="/patient/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="rounded-xl px-3 py-2 text-sm text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PatientLayout;
