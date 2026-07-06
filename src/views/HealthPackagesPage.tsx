import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck2, CircleCheck, Clock3, HeartPulse, ShieldCheck, WalletCards } from "lucide-react";

const packages = [
  {
    name: "Executive Health Check",
    price: "$199",
    duration: "2.5-3 hours",
    idealFor: "Working professionals",
    items: ["CBC, LFT, KFT", "Cardiac profile", "Chest X-ray", "Diet consult"],
  },
  {
    name: "Cardiac Screening",
    price: "$149",
    duration: "2 hours",
    idealFor: "Heart-risk assessment",
    items: ["ECG", "Echo", "TMT", "Lipid profile"],
  },
  {
    name: "Diabetes Care",
    price: "$129",
    duration: "1.5-2 hours",
    idealFor: "Sugar management",
    items: ["FBS/PPBS/HbA1c", "Foot assessment", "Dietician consult"],
  },
  {
    name: "Women Wellness",
    price: "$159",
    duration: "2-2.5 hours",
    idealFor: "Preventive women health",
    items: ["Thyroid profile", "Pap smear", "USG abdomen", "Gyne consult"],
  },
];

const process = [
  { icon: CalendarCheck2, title: "Book Slot", detail: "Choose package and preferred date/time for screening." },
  { icon: HeartPulse, title: "Tests & Consult", detail: "Complete tests and specialist review in one visit." },
  { icon: CircleCheck, title: "Reports + Advice", detail: "Get reports with doctor guidance and lifestyle plan." },
];

const notes = [
  "8-10 hours fasting may be required for selected blood tests.",
  "Carry previous medical reports and current medication list.",
  "Package prices may vary based on additional tests advised by doctor.",
  "Corporate/group wellness custom bundles are available on request.",
];

const HealthPackagesPage = () => {
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
                <Badge className="border border-white/20 bg-white/10 text-white hover:bg-white/10">Health Packages</Badge>
                <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Preventive Screening Bundles</h1>
                <p className="mt-4 max-w-2xl text-white/80">
                  Curated diagnostic and consultation packages designed for early detection and long-term wellness.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/appointment">
                    <Button className="gap-2 bg-white text-hospital-navy hover:bg-white/90">
                      Book Package <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      Request Callback
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-primary/20 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Package Snapshot</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-2xl font-bold text-foreground">{packages.length}</p>
                  <p className="text-xs text-muted-foreground">Popular preventive bundles</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-2xl font-bold text-foreground">$129+</p>
                  <p className="text-xs text-muted-foreground">Starting package price</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-2xl font-bold text-foreground">Same Day</p>
                  <p className="text-xs text-muted-foreground">Reports for selected tests</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border bg-muted/40 p-4">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <WalletCards className="h-3.5 w-3.5" />
                  Billing & Payment
                </div>
                <p className="text-sm text-muted-foreground">
                  Insurance eligibility for preventive packages may vary by policy. Please confirm before booking.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="container">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Available Packages</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">Choose What Fits Your Need</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {packages.map((pkg) => (
              <Card key={pkg.name} className="rounded-2xl border-l-4 border-l-primary p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{pkg.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{pkg.idealFor}</p>
                  </div>
                  <Badge variant="secondary" className="text-sm">{pkg.price}</Badge>
                </div>

                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <Clock3 className="h-3.5 w-3.5" />
                  {pkg.duration}
                </div>

                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {pkg.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <Link to="/appointment">
                    <Button size="sm" className="rounded-full">Select Package</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="container pt-10">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How It Works</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">Simple 3-Step Process</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {process.map((item) => (
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

        <section className="container pt-10">
          <Card className="rounded-2xl border-primary/20 p-6">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">Important Notes</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {notes.map((note) => (
                <div key={note} className="rounded-xl border bg-card px-3 py-2.5 text-sm text-muted-foreground">
                  {note}
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

export default HealthPackagesPage;
