import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import mentorImage from "@/assets/doctor-3.jpg";
import { imageSrc } from "@/lib/image";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Microscope,
  ShieldCheck,
  Users,
} from "lucide-react";

const snapshot = [
  { value: "180+", label: "Trainees / year" },
  { value: "12+", label: "Program tracks" },
  { value: "40+", label: "Faculty mentors" },
  { value: "95%", label: "Completion rate" },
];

const tracks = [
  {
    icon: GraduationCap,
    title: "Residency Training",
    duration: "3 Years",
    seats: "24 seats",
    detail: "Structured specialty rotations with bedside supervision and simulation lab practice.",
  },
  {
    icon: ShieldCheck,
    title: "Nursing Education",
    duration: "18 Months",
    seats: "36 seats",
    detail: "Hands-on ICU, OT, and emergency upskilling with patient safety modules.",
  },
  {
    icon: Microscope,
    title: "Allied Health Internships",
    duration: "6-12 Months",
    seats: "40 seats",
    detail: "Clinical pathways for physiotherapy, laboratory medicine, and radiology trainees.",
  },
  {
    icon: BookOpen,
    title: "Continuing Medical Education (CME)",
    duration: "Monthly",
    seats: "Open",
    detail: "Case-based CMEs, journal clubs, and practical workshops led by specialist faculty.",
  },
];

const roadmap = [
  { period: "Jan-Mar", title: "Foundation", detail: "Orientation, patient safety modules, and supervised onboarding." },
  { period: "Apr-Jun", title: "Core Rotations", detail: "Emergency, ICU, wards, and specialty exposure in active units." },
  { period: "Jul-Sep", title: "Skill Review", detail: "Simulation drills, case presentations, and competency checks." },
  { period: "Oct-Dec", title: "Capstone", detail: "Quality audits, research abstracts, and final evaluations." },
];

const outcomes = [
  "Faster onboarding of junior clinicians into safe workflows.",
  "Improved interdisciplinary decision-making in critical care.",
  "Higher protocol adherence through mentor-led reviews.",
  "Clear career progression via certifications and CME credits.",
];

const AcademicsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-14">
        <section className="border-b bg-muted/30">
          <div className="container py-10 md:py-14">
            <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
              <Card className="relative overflow-hidden rounded-3xl border-primary/20 p-6 md:p-8">
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-dashed border-primary/30" />
                <div className="absolute -bottom-14 -left-8 h-28 w-28 rounded-full bg-primary/5" />

                <div className="relative">
                  <Badge className="border border-primary/20 bg-background text-primary hover:bg-background">
                    Academics
                  </Badge>
                  <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-5xl">
                    Academic Command Center
                  </h1>
                  <p className="mt-4 max-w-2xl text-muted-foreground">
                    This page is dedicated to how we train clinicians in real hospital environments. Programs are built
                    around supervision, simulation, and measurable skill development.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-dashed bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Model 01</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Rotation-led curriculum aligned with patient safety checkpoints.
                      </p>
                    </div>
                    <div className="rounded-xl border border-dashed bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Model 02</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Faculty mentoring cycles with direct practical performance feedback.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/careers">
                      <Button className="gap-2">
                        Explore Careers <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline">Academic Enquiry</Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <Card className="rounded-3xl border-primary/20 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live Snapshot</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {snapshot.map((item) => (
                      <div key={item.label} className="rounded-xl border bg-card p-3">
                        <p className="text-xl font-bold text-foreground">{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="overflow-hidden rounded-3xl border-primary/20 p-0">
                  <div className="grid items-center sm:grid-cols-[112px,1fr] lg:grid-cols-[104px,1fr]">
                    <img
                      src={imageSrc(mentorImage)}
                      alt="Academic faculty mentor"
                      className="h-32 w-full object-cover sm:h-full"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        <Users className="h-3.5 w-3.5" />
                        Mentorship Cell
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Weekly mentor boards review clinical progress, simulation performance, and communication skills.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12">
          <div className="grid gap-6 xl:grid-cols-[1.25fr,0.75fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Training Tracks</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Programs Built for Clinical Readiness</h2>

              <div className="mt-6 space-y-4">
                {tracks.map((item) => (
                  <Card key={item.title} className="rounded-2xl border-l-4 border-l-primary p-5 shadow-card">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">{item.duration}</span>
                        <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-muted-foreground">{item.seats}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="h-fit rounded-2xl border-primary/20 p-6">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-wider">Expected Outcomes</p>
              </div>
              <div className="space-y-3">
                {outcomes.map((item) => (
                  <div key={item} className="rounded-xl border bg-card px-3 py-2.5">
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="container pb-6">
          <Card className="rounded-3xl border-primary/20 p-6 md:p-8">
            <div className="mb-5 flex items-center gap-2 text-primary">
              <Clock3 className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">Academic Roadmap 2026</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {roadmap.map((item, index) => (
                <div key={item.period} className="rounded-xl border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phase {index + 1}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">{item.period}</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AcademicsPage;
