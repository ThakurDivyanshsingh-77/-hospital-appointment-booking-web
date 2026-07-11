import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "@/components/NavLink";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  LogOut,
  Stethoscope,
  Sparkles,
  Users,
  User,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/doctor",
    icon: LayoutDashboard,
    subtitle: "Today summary",
  },
  {
    title: "Appointments",
    url: "/doctor/appointments",
    icon: CalendarDays,
    subtitle: "Patient requests",
  },
  {
    title: "Availability",
    url: "/doctor/availability",
    icon: Clock,
    subtitle: "Slot planning",
  },
  {
    title: "Patients",
    url: "/doctor/patients",
    icon: Users,
    subtitle: "My patients",
  },
  {
    title: "Profile",
    url: "/doctor/profile",
    icon: User,
    subtitle: "Doctor profile",
  },
  {
    title: "Settings",
    url: "/doctor/settings",
    icon: Settings,
    subtitle: "Account settings",
  },
];

const DoctorSidebar = () => {
  const { signOut } = useAuth();
  const sidebar = useSidebar();
  const collapsed = sidebar.state === "collapsed";
  const [profile, setProfile] = useState<{ fullName: string; specialty: string } | null>(null);

  useEffect(() => {
    apiRequest<{ fullName: string; specialty: string }>("/doctor/profile")
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  return (
    <Sidebar collapsible="icon" variant="floating" className="p-2">
      <SidebarHeader className="p-2">
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-sm">
              <Stethoscope className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">Doctor Portal</p>
                <p className="truncate text-xs text-slate-500">CareConnect Clinical</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-2.5 py-2 text-xs text-blue-700">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Smart scheduling enabled
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-2">
        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="px-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="h-auto rounded-xl p-0">
                    <NavLink
                      to={item.url}
                      end={item.url === "/doctor"}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                      activeClassName="bg-blue-100/80 font-semibold text-blue-900 shadow-[inset_0_0_0_1px_rgba(109,40,217,0.22)]"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                        <p className="truncate text-sm">{item.title}</p>
                        <p className="truncate text-[11px] text-slate-500">{item.subtitle}</p>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        {!collapsed && profile && (
          <div className="mb-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-sm">
                {profile.fullName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800">
                  {profile.fullName.startsWith("Dr.") ? profile.fullName : `Dr. ${profile.fullName}`}
                </p>
                <p className="truncate text-[10px] text-slate-500">{profile.specialty}</p>
                <p className="flex items-center gap-1 text-[9px] text-blue-600 font-semibold mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Online
                </p>
              </div>
            </div>
          </div>
        )}
        <SidebarSeparator className="mx-0 mb-2 bg-slate-200" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="h-10 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              tooltip="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DoctorSidebar;
