import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import mentorImage from "@/assets/doctor-2.jpg";
import { imageSrc } from "@/lib/image";
import { ArrowRight, Briefcase, CheckCircle2, Clock3, MapPin, ShieldCheck, Stethoscope, Users } from "lucide-react";

const hiringStats = [
  { value: "24+", label: "Open positions" },
  { value: "48 hrs", label: "Initial response" },
  { value: "4 Rounds", label: "Selection process" },
];

const openings = [
  {
    role: "Staff Nurse - ICU",
    department: "Critical Care",
    location: "Main Campus",
    type: "Full-time",
    experience: "2-4 years",
  },
  {
    role: "Resident Doctor - Emergency",
    department: "Emergency Medicine",
    location: "ER Block",
    type: "Full-time",
    experience: "1-3 years",
  },
  {
    role: "Physiotherapist",
    department: "Rehabilitation",
    location: "Rehab Center",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    role: "Medical Records Executive",
    department: "Health Information",
    location: "Admin Wing",
    type: "Full-time",
    experience: "1-2 years",
  },
];

const processSteps = [
  "Online profile screening by HR and department leads.",
  "Technical and behavioral interview round.",
  "Shadow shift or practical skill evaluation.",
  "Final discussion with offer and onboarding plan.",
];

const benefits = [
  "Structured learning and internal upskilling support.",
  "Mentor-led growth plans for every role.",
  "Transparent performance review and fast-track promotions.",
  "Collaborative, patient-first workplace culture.",
];

const culturePillars = [
  {
    icon: Users,
    title: "Team-Based Care",
    detail: "Doctors, nurses, and allied teams work in coordinated care paths.",
  },
  {
    icon: ShieldCheck,
    title: "Safety Standards",
    detail: "Strict quality, infection control, and ethics-first practice environment.",
  },
  {
    icon: Stethoscope,
    title: "Clinical Growth",
    detail: "Continuous education, CME access, and hands-on training support.",
  },
];

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-14">
        <section className="container py-10 md:py-12">
          <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
            <Card className="relative overflow-hidden rounded-3xl border-0 bg-hospital-navy p-6 text-white md:p-8">
              <div className="absolute -right-16 top-0 h-40 w-40 rounded-full border border-white/15" />
              <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-primary/30 blur-3xl" />

              <div className="relative">
                <Badge className="border border-white/20 bg-white/10 text-white hover:bg-white/10">Careers</Badge>
                <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                  Build Your Career Where Care Comes First
                </h1>
                <p className="mt-4 max-w-2xl text-white/80">
                  Join a multidisciplinary team focused on patient outcomes, continuous learning, and safe clinical
                  practices. We hire professionals who value empathy and excellence equally.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {hiringStats.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/15 bg-white/10 p-3">
                      <p className="text-xl font-bold">{item.value}</p>
                      <p className="text-xs text-white/70">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/contact">
                    <Button className="gap-2 bg-white text-hospital-navy hover:bg-white/90">
                      Talk to HR <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="mailto:care@medicare.com">
                    <Button
                      variant="outline"
                      className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      Send Resume
                    </Button>
                  </a>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden rounded-3xl border-primary/20 p-0">
              <div className="border-b bg-muted/40 px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Hiring Process</p>
              </div>
              <div className="space-y-2 p-4">
                {processSteps.map((item, index) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border bg-card p-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <div className="grid items-center gap-4 border-t bg-muted/20 p-4 sm:grid-cols-[96px,1fr]">
                <img
                  src={imageSrc(mentorImage)}
                  alt="HR and clinical hiring team"
                  className="h-20 w-24 rounded-xl object-cover"
                  loading="lazy"
                />
                <p className="text-sm text-muted-foreground">
                  Fast, transparent, and role-specific hiring designed to keep candidates informed at each stage.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="container">
          <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
            <div>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Open Roles</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground">Current Openings</h2>
              </div>

              <div className="space-y-3">
                {openings.map((job) => (
                  <Card key={job.role} className="rounded-2xl border-l-4 border-l-primary p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{job.role}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{job.department}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                            <Briefcase className="h-3.5 w-3.5" />
                            {job.type}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
                            <Clock3 className="h-3.5 w-3.5" />
                            {job.experience}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="rounded-full">Apply</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="h-fit rounded-2xl border-primary/20 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why Join MediCare</p>
              <div className="mt-4 space-y-3">
                {benefits.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border bg-card px-3 py-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-hospital-success" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="container pt-10">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Culture</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">How We Work</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {culturePillars.map((item) => (
              <Card key={item.title} className="rounded-2xl p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;
