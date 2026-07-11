import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Building2,
  Image,
  LogOut,
  ShieldPlus,
  Sparkles,
  FileText,
  Settings,
  CheckCircle2,
  ArrowRight,
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
    url: "/admin",
    icon: LayoutDashboard,
    subtitle: "Overview & Analytics",
  },
  {
    title: "Doctors",
    url: "/admin/doctors",
    icon: Users,
    subtitle: "Manage specialists",
  },
  {
    title: "Appointments",
    url: "/admin/appointments",
    icon: CalendarDays,
    subtitle: "Bookings & Schedule",
  },
  {
    title: "Departments",
    url: "/admin/departments",
    icon: Building2,
    subtitle: "Service units",
  },
  {
    title: "Gallery",
    url: "/admin/gallery",
    icon: Image,
    subtitle: "Media showcase",
  },
  {
    title: "Patients",
    url: "/admin/patients",
    icon: Users,
    subtitle: "Patient management",
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: FileText,
    subtitle: "Analytics & Insights",
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    subtitle: "System configuration",
  },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const sidebar = useSidebar();
  const collapsed = sidebar.state === "collapsed";

  return (
    <Sidebar collapsible="icon" variant="floating" className="p-2 border-r border-slate-100 bg-white">
      <SidebarHeader className="p-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <ShieldPlus className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-base font-bold tracking-tight text-slate-900">CareConnect</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Admin Console</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>5 modules connected</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-2">
        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="h-auto rounded-xl p-0 hover:bg-transparent">
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600 transition-all hover:bg-blue-50/70 hover:text-blue-800"
                      activeClassName="bg-blue-100/70 font-semibold text-blue-900 shadow-[inset_0_0_0_1px_rgba(109,40,217,0.15)]"
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0 text-slate-500 group-data-[active=true]:text-blue-700" />
                      <div className="flex flex-1 items-center justify-between min-w-0 group-data-[collapsible=icon]:hidden">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.title}</p>
                          <p className="truncate text-[10px] text-slate-400 font-normal">{item.subtitle}</p>
                        </div>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 gap-3">
        {!collapsed && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white shadow-md shadow-blue-500/10">
            <div className="relative z-10">
              <p className="text-sm font-bold">Need Help?</p>
              <p className="text-[10px] text-blue-100 mt-1 leading-normal">
                System status is optimal. All systems running smoothly.
              </p>
              <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-center text-xs font-bold text-blue-700 transition-all hover:bg-blue-50 shadow-sm">
                <span>View System Status</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            {/* Background decorative blob */}
            <div className="absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-white/10 blur-xl" />
          </div>
        )}

        <SidebarSeparator className="mx-0 bg-slate-100" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="h-10 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              tooltip="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
