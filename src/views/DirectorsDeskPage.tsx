import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import directorImage from "@/assets/doctor-2.jpg";
import { imageSrc } from "@/lib/image";
import { ArrowRight, Award, CheckCircle2, Mail, Phone, Shield, TrendingUp, Users } from "lucide-react";

const guidingPrinciples = [
  {
    icon: Shield,
    title: "Safety First",
    detail: "Every protocol, audit, and checklist is designed to protect patients at every step.",
  },
  {
    icon: Users,
    title: "Human-Centered Care",
    detail: "Clinical decisions are driven by empathy, transparent communication, and dignity.",
  },
  {
    icon: Award,
    title: "Clinical Excellence",
    detail: "Best-practice medicine, continuous training, and measurable outcomes guide our team.",
  },
];

const strategicPriorities = [
  "Zero-delay emergency triage for critical cases.",
  "Digital-first patient journey from booking to discharge.",
  "Higher infection-prevention benchmarks across all wards.",
  "Stronger family counseling and post-treatment continuity care.",
];

const impactHighlights = [
  { value: "20+", label: "Years in tertiary care leadership" },
  { value: "40k+", label: "Patients guided through quality initiatives" },
  { value: "99.1%", label: "Clinical protocol adherence in audits" },
];

const DirectorsDeskPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 md:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-hospital-navy p-6 text-white shadow-card-hover md:p-10">
          <div className="absolute -left-14 top-4 h-44 w-44 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-hospital-success/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="space-y-6">
              <Badge className="bg-white/15 text-white hover:bg-white/15">Director's Desk</Badge>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                  A Personal Note From Our Medical Director
                </h1>
                <p className="max-w-2xl text-white/80">
                  Our promise is simple: every patient should feel safe, heard, and confident in the quality of care.
                  We continue to invest in advanced systems, skilled teams, and compassionate care pathways.
                </p>
              </div>

              <blockquote className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm leading-relaxed text-white/90">
                "Clinical excellence matters most when it reaches people with empathy. At MediCare, we are building a
                culture where outcomes and compassion rise together."
              </blockquote>

              <div className="flex flex-wrap gap-3">
                <Link to="/appointment">
                  <Button size="lg" className="gap-2 bg-white text-hospital-navy hover:bg-white/90">
                    Book Appointment <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    Contact Director's Office
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="overflow-hidden border-white/20 bg-white/10 p-4 text-white shadow-none backdrop-blur">
              <img
                src={imageSrc(directorImage)}
                alt="Dr. Ananya Mehta"
                className="h-56 w-full rounded-xl object-cover object-top"
                loading="lazy"
              />

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Medical Director</p>
                <h2 className="text-xl font-semibold">Dr. Ananya Mehta, MD, FRCP</h2>
                <p className="text-sm text-white/80">
                  Head, Quality & Patient Safety | 20+ years in tertiary and critical care strategy.
                </p>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90">
                  <Phone className="h-4 w-4 text-white/75" />
                  +1 (800) 123-4567
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90">
                  <Mail className="h-4 w-4 text-white/75" />
                  care@medicare.com
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {guidingPrinciples.map((item) => (
            <Card key={item.title} className="rounded-2xl p-5 shadow-card transition hover:shadow-card-hover">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
            </Card>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="rounded-2xl border-primary/15 p-6">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <TrendingUp className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">2026 Strategic Priorities</p>
            </div>
            <div className="space-y-3">
              {strategicPriorities.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-xl border bg-card p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-hospital-success" />
                  <p className="text-sm text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Leadership Impact</p>
            <div className="mt-4 space-y-4">
              {impactHighlights.map((item) => (
                <div key={item.label} className="rounded-xl border bg-card px-4 py-3">
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
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

export default DirectorsDeskPage;
