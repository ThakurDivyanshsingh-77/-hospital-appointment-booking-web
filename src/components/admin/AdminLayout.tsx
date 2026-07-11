import { ReactNode, useMemo } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { Bell, ChevronDown, Search, Calendar, Download } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const routeNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/doctors": "Doctors",
  "/admin/appointments": "Appointments",
  "/admin/departments": "Departments",
  "/admin/gallery": "Gallery",
  "/admin/patients": "Patients",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
};

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const sectionName = useMemo(() => routeNames[location.pathname] || "Admin", [location.pathname]);

  const getInitials = (name?: string) => {
    if (!name) return "A";
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
        <div className="pointer-events-none absolute -right-16 top-24 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl" />

        <AdminSidebar />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Main Top Header */}
          <header className="sticky top-0 z-20 bg-white/80 px-6 py-4 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors" />
              <div className="min-w-0">
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Welcome back, Administrator 👋
                </span>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar Input */}
              <div className="relative hidden md:flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="h-10 w-60 rounded-xl border border-slate-200 pl-10 pr-12 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50"
                />
                <span className="absolute right-3 rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-semibold text-slate-450 tracking-wider">
                  Ctrl+K
                </span>
              </div>

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
                        <p className="text-xs font-bold text-slate-900">{user?.fullName || "Administrator"}</p>
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 uppercase">
                          Super Admin
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{user?.email || "admin@careconnect.com"}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-100">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-slate-450 uppercase tracking-wider">
                    Operations
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm focus:bg-blue-50 focus:text-blue-900 cursor-pointer">
                    <Link to="/admin/settings">System Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm focus:bg-blue-50 focus:text-blue-900 cursor-pointer">
                    <Link to="/admin/reports">Usage Logs</Link>
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

          {/* Sub-Header actions row */}
          <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-500">{subtitle}</p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {/* Datepicker Mock */}
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span>Today, 6 July 2026</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Export Report Action */}
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
