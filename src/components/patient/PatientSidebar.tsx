import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  FileText,
  Pill,
  MessageSquare,
  User,
  Settings,
  LogOut,
  HeartPulse,
  Sparkles,
  ChevronRight,
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
    title: "Overview",
    url: "/patient",
    icon: LayoutDashboard,
    subtitle: "Health summary",
  },
  {
    title: "Book Appointment",
    url: "/patient/book",
    icon: CalendarPlus,
    subtitle: "New consultation",
  },
  {
    title: "My Appointments",
    url: "/patient/appointments",
    icon: CalendarDays,
    subtitle: "History and reports",
  },
  {
    title: "Health Records",
    url: "/patient/records",
    icon: FileText,
    subtitle: "Medical documents",
  },
  {
    title: "Prescriptions",
    url: "/patient/prescriptions",
    icon: Pill,
    subtitle: "Your medications",
  },
  {
    title: "Messages",
    url: "/patient/messages",
    icon: MessageSquare,
    subtitle: "Doctor messages",
    badge: 2,
  },
  {
    title: "Profile",
    url: "/patient/profile",
    icon: User,
    subtitle: "Personal information",
  },
  {
    title: "Settings",
    url: "/patient/settings",
    icon: Settings,
    subtitle: "Account settings",
  },
];

const PatientSidebar = () => {
  const { user, signOut } = useAuth();
  const sidebar = useSidebar();
  const collapsed = sidebar.state === "collapsed";

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
    <Sidebar collapsible="icon" variant="floating" className="p-2 border-r border-slate-100 bg-white">
      <SidebarHeader className="p-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <HeartPulse className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-base font-bold tracking-tight text-slate-900">CareConnect</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Patient Portal</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-2.5 py-2 text-xs font-medium text-blue-700">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>Health journey dashboard</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-2">
        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="h-auto rounded-xl p-0 hover:bg-transparent">
                    <NavLink
                      to={item.url}
                      end={item.url === "/patient"}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600 transition-all hover:bg-blue-50/70 hover:text-blue-800"
                      activeClassName="bg-blue-100/70 font-semibold text-blue-900 shadow-[inset_0_0_0_1px_rgba(109,40,217,0.15)]"
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0 text-slate-500 group-data-[active=true]:text-blue-700" />
                      <div className="flex flex-1 items-center justify-between min-w-0 group-data-[collapsible=icon]:hidden">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.title}</p>
                          <p className="truncate text-[10px] text-slate-400 font-normal">{item.subtitle}</p>
                        </div>
                        {item.badge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 gap-2">
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm">
              {getInitials(user?.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.fullName || "Akash Yadav"}</p>
              <p className="truncate text-[11px] text-slate-500">{user?.email || "akash@gmail.com"}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
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

export default PatientSidebar;
