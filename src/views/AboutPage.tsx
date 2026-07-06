import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-hospital.jpg";
import doctorImage from "@/assets/doctor-1.jpg";
import { imageSrc } from "@/lib/image";
import { Award, CheckCircle2, Clock, Shield, Stethoscope, Users } from "lucide-react";

const values = [
  { icon: Users, title: "Patient-Centered", desc: "Care plans are personalized for every patient and family." },
  { icon: Award, title: "Clinical Excellence", desc: "Evidence-based protocols with continuous quality audits." },
  { icon: Clock, title: "Always Available", desc: "Round-the-clock emergency, diagnostics, and support teams." },
  { icon: Shield, title: "Integrity & Trust", desc: "Transparent communication and ethical clinical decisions." },
];

const highlights = [
  { value: "30+", label: "Years of trusted care" },
  { value: "40k+", label: "Patients served annually" },
  { value: "25+", label: "Specialties under one roof" },
];

const milestones = [
  { year: "1995", title: "Foundation", detail: "Started as a community-focused multi-speciality center." },
  { year: "2008", title: "Expansion", detail: "Added advanced ICUs, modular OTs, and imaging services." },
  { year: "2026", title: "Digital Care", detail: "Enabled end-to-end digital appointment and report workflows." },
];

const commitments = [
  "Faster diagnosis through integrated specialist collaboration.",
  "Clear communication so families always know the care plan.",
  "Strict infection prevention and safety-first operating standards.",
  "Affordable health packages for preventive and long-term wellness.",
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-hospital-purple-light/40">
          <div className="absolute -left-24 top-4 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-hospital-success/15 blur-3xl" />

          <div className="container relative grid items-center gap-12 py-14 md:py-16 lg:grid-cols-[1.05fr,0.95fr]">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">About Us</Badge>
              <h1 className="text-3xl font-bold leading-tight text-foreground md:text-5xl">
                Compassion, Science, and Trust Under One Roof
              </h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                MediCare Multi-Speciality Hospital combines advanced technology with human-centered treatment. Since
                1995, our focus has remained the same: safe care, better outcomes, and dignity for every patient.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <Card key={item.label} className="rounded-xl border-primary/15 p-4">
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <img
                src={imageSrc(heroImage)}
                alt="MediCare hospital building"
                className="h-72 w-full rounded-2xl object-cover shadow-card-hover md:h-80"
                loading="eager"
              />
              <Card className="grid items-center gap-4 rounded-2xl border-primary/15 p-4 sm:grid-cols-[96px,1fr]">
                <img
                  src={imageSrc(doctorImage)}
                  alt="Senior medical specialist at MediCare"
                  className="h-24 w-24 rounded-xl object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-primary">Leadership Commitment</p>
                  <p className="text-sm text-muted-foreground">
                    "We deliver care that is not only clinically strong, but also emotionally reassuring for families."
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Mission</p>
              <h2 className="mb-4 mt-2 text-3xl font-bold text-foreground">Healthcare That Feels Personal</h2>
              <p className="leading-relaxed text-muted-foreground">
                We deliver exceptional healthcare through a balance of innovation, compassion, and measurable quality.
                Our multidisciplinary teams work as one system so diagnosis, treatment, and recovery are seamless.
              </p>
              <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="leading-relaxed text-muted-foreground">
                To set the benchmark for safe, accessible, and high-trust care in the region while making advanced
                treatment pathways affordable for all communities.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl border bg-card p-5 shadow-card transition hover:shadow-card-hover">
                  <v.icon className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 text-base font-semibold text-foreground">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="container grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <Card className="rounded-2xl border-primary/15 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Stethoscope className="h-3.5 w-3.5" />
                Why Families Choose MediCare
              </div>
              <div className="space-y-3">
                {commitments.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border bg-card px-3 py-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-hospital-success" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Journey</p>
              <div className="mt-4 space-y-4">
                {milestones.map((item) => (
                  <div key={item.year} className="rounded-xl border bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.year}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
