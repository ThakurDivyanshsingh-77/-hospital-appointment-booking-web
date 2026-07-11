import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Database,
  FileText,
  GalleryHorizontalEnd,
  HeartPulse,
  LockKeyhole,
  Mail,
  Network,
  Server,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  Workflow,
} from "lucide-react";

type InfoCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  points?: string[];
};

const overviewStats = [
  { label: "Protected roles", value: "3" },
  { label: "Public modules", value: "8+" },
  { label: "API route groups", value: "6" },
  { label: "Core database models", value: "6" },
];

const roles: InfoCard[] = [
  {
    title: "Public Visitor",
    description: "Browses hospital information before creating an account or contacting the hospital.",
    icon: Users,
    points: ["Home, about, doctors, departments, gallery, health packages", "Contact and feedback forms", "Appointment entry point redirects users to the correct portal"],
  },
  {
    title: "Patient",
    description: "Creates a self-service account and manages the appointment journey.",
    icon: HeartPulse,
    points: ["Sign up and sign in with JWT authentication", "Book appointments by department, doctor, date, and live slot", "View booking status and upload medical reports for accepted appointments"],
  },
  {
    title: "Doctor",
    description: "Works from a clinical dashboard focused on appointments and patient follow-up.",
    icon: Stethoscope,
    points: ["Review pending, accepted, and rejected appointments", "Accept or reject appointment requests", "View assigned patients and medical reports"],
  },
  {
    title: "Admin",
    description: "Controls hospital operations, master data, and public content.",
    icon: ShieldCheck,
    points: ["Manage doctors, departments, appointments, and gallery items", "Activate or deactivate doctors and departments", "Track dashboard analytics and recent appointment activity"],
  },
];

const workflow = [
  {
    title: "1. Access",
    description: "A visitor can browse public pages. Patients sign up directly, while doctor accounts are created by an admin.",
  },
  {
    title: "2. Booking",
    description: "A patient selects a department, doctor, date, and time slot. The API blocks duplicate active bookings for the same doctor and slot.",
  },
  {
    title: "3. Doctor Review",
    description: "The doctor reviews requests from the doctor portal and marks each appointment as accepted or rejected.",
  },
  {
    title: "4. Reports",
    description: "After acceptance, patients can upload PDF or image reports. Patients, assigned doctors, and admins can download permitted reports.",
  },
  {
    title: "5. Admin Oversight",
    description: "Admins monitor totals, appointment trends, doctor workload, public gallery content, departments, and doctor availability.",
  },
];

const features: InfoCard[] = [
  {
    title: "Authentication and RBAC",
    description: "JWT login, patient signup, protected frontend routes, and backend middleware for admin, doctor, and patient access.",
    icon: LockKeyhole,
  },
  {
    title: "Appointment Management",
    description: "Booking metadata, live booked-slot checks, appointment status filters, and doctor approval workflow.",
    icon: CalendarCheck,
  },
  {
    title: "Doctor and Department Setup",
    description: "Admins create doctor accounts, assign specialties and departments, and toggle active status for booking control.",
    icon: Building2,
  },
  {
    title: "Medical Reports",
    description: "Patients upload PDFs or images with Multer storage. Report download permissions are checked by role and ownership.",
    icon: FileText,
  },
  {
    title: "Dashboards and Analytics",
    description: "Admin, doctor, and patient dashboards summarize operational counts, upcoming visits, and appointment status.",
    icon: BarChart3,
  },
  {
    title: "Public Website Content",
    description: "Hospital pages include departments, doctors, health packages, gallery, testimonials, careers, academics, and contact.",
    icon: GalleryHorizontalEnd,
  },
  {
    title: "Feedback Email",
    description: "Public feedback is validated, rate limited, and delivered through the backend mailer when SMTP is configured.",
    icon: Mail,
  },
  {
    title: "Responsive UI System",
    description: "The frontend uses reusable UI components, dashboards, mobile navigation, tables, dialogs, and form controls.",
    icon: Activity,
  },
];

const stackGroups = [
  {
    title: "Frontend",
    icon: Network,
    items: ["Next.js", "React", "TypeScript", "React Router", "TanStack Query", "Tailwind CSS", "Radix UI components", "Lucide icons", "Recharts"],
  },
  {
    title: "Backend",
    icon: Server,
    items: ["Node.js", "Express.js", "Mongoose", "JWT", "bcryptjs", "CORS", "Morgan", "Nodemailer"],
  },
  {
    title: "Database and Files",
    icon: Database,
    items: ["MongoDB", "Mongoose models", "Multer local uploads", "Seeded default departments", "Optional seeded admin account"],
  },
  {
    title: "Dev and Deployment",
    icon: Workflow,
    items: ["npm scripts", "Vitest", "ESLint", "dotenv", "Nodemon", "Vercel config", "Netlify config"],
  },
];

const routeGroups = [
  {
    title: "Public Website",
    routes: "/, /about, /departments, /doctors, /appointment, /gallery, /feedback, /contact",
  },
  {
    title: "Admin Portal",
    routes: "/admin, /admin/doctors, /admin/appointments, /admin/departments, /admin/gallery",
  },
  {
    title: "Doctor Portal",
    routes: "/doctor, /doctor/appointments, /doctor/availability, /doctor/patients, /doctor/profile",
  },
  {
    title: "Patient Portal",
    routes: "/patient, /patient/book, /patient/appointments, /patient/records, /patient/profile",
  },
];

const ProjectBriefPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b bg-slate-50 py-16">
          <div className="container grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div>
              <Badge className="mb-4 rounded-md bg-primary/10 text-primary hover:bg-primary/10">Project Brief</Badge>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight text-foreground md:text-5xl">
                CareConnect is a role-based hospital management platform.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                The project connects public hospital pages with secure patient, doctor, and admin portals. It manages
                appointments, doctor profiles, departments, reports, gallery content, and operational dashboard data
                through a React frontend and Express MongoDB backend.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    <UserRound className="h-4 w-4" />
                    Open Login Portal
                  </Button>
                </Link>
                <Link to="/appointment">
                  <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                    <CalendarCheck className="h-4 w-4" />
                    Appointment Flow
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {overviewStats.map((item) => (
                <Card key={item.label} className="rounded-lg border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Roles</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">Who Uses The System</h2>
              <p className="mt-3 text-muted-foreground">
                Each role gets a different route set, API permission level, and dashboard experience.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {roles.map((role) => (
                <Card key={role.title} className="rounded-lg border-slate-200 bg-white p-5 shadow-sm">
                  <role.icon className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="text-lg font-semibold text-slate-900">{role.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{role.description}</p>
                  <ul className="mt-4 space-y-2">
                    {role.points?.map((point) => (
                      <li key={point} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y bg-slate-50 py-14">
          <div className="container grid gap-10 lg:grid-cols-[0.85fr,1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Workflow</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">How It Works</h2>
              <p className="mt-3 text-muted-foreground">
                The main journey starts with patient access, moves through booking and doctor review, then ends with
                reports and admin monitoring.
              </p>
            </div>
            <div className="space-y-3">
              {workflow.map((item) => (
                <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Features</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">Main Feature Set</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="rounded-lg border-slate-200 bg-white p-5 shadow-sm">
                  <feature.icon className="mb-4 h-7 w-7 text-primary" />
                  <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y bg-slate-50 py-14">
          <div className="container">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Stack</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">Technology Used</h2>
              <p className="mt-3 text-muted-foreground">
                The app is a MERN-style system: React and Next.js on the frontend, Express on the backend, MongoDB for
                persistence, and local file storage for uploads.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stackGroups.map((group) => (
                <Card key={group.title} className="rounded-lg border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                      <group.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">{group.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {item}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Routes</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">Page And Module Map</h2>
              <p className="mt-3 text-muted-foreground">
                Public pages are open. Admin, doctor, and patient pages are wrapped with role-specific protected
                routes in the frontend and matching backend middleware.
              </p>
            </div>
            <div className="space-y-3">
              {routeGroups.map((group) => (
                <Card key={group.title} className="rounded-lg border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">{group.title}</h3>
                  <p className="mt-2 break-words text-sm leading-relaxed text-slate-500">{group.routes}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectBriefPage;
