import { Link } from "react-router-dom";
import { Phone, ArrowRight, CalendarCheck2, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-hospital.jpg";
import { imageSrc } from "@/lib/image";

const highlights = [
  { icon: HeartPulse, label: "24/7 Emergency Coverage" },
  { icon: ShieldCheck, label: "Evidence-Based Protocols" },
  { icon: Stethoscope, label: "Specialist-Led Care Paths" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-muted/30">
      <div className="absolute -left-24 top-0 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-hospital-success/10 blur-3xl" />

      <div className="container relative z-10 grid items-center gap-8 py-12 lg:grid-cols-[1.05fr,0.95fr] lg:py-16">
        <div className="animate-fade-in">
          <div className="rounded-3xl bg-hospital-navy p-6 text-white shadow-card-hover md:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-hospital-success" />
              Trusted Multi-Speciality Hospital Since 1995
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Advanced Care.
              <br />
              <span className="text-white/80">Human Touch.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/75">
              From emergency response to long-term treatment, our specialists and support teams work together to
              deliver safe, compassionate, and coordinated care.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/appointment">
                <Button size="lg" className="gap-2 bg-white text-hospital-navy hover:bg-white/90">
                  Book Appointment <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+18001234567">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Phone className="h-4 w-4" /> Emergency Call
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-xl border bg-card p-3">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs font-medium text-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:200ms] opacity-0">
          <div className="relative overflow-hidden rounded-3xl border bg-card p-3 shadow-card-hover">
            <img
              src={imageSrc(heroImage)}
              alt="MediCare Hospital Building"
              className="h-[420px] w-full rounded-2xl object-cover"
              loading="eager"
            />

            <div className="absolute left-7 top-7 rounded-xl border bg-background/95 p-3 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live Support</p>
              <p className="text-sm font-semibold text-foreground">ER team available 24/7</p>
            </div>

            <div className="absolute bottom-7 right-7 rounded-xl border bg-background/95 p-3 shadow-card">
              <div className="mb-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <CalendarCheck2 className="h-3.5 w-3.5" />
                Daily Care Flow
              </div>
              <p className="text-sm font-semibold text-foreground">500+ OPD consultations/day</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
