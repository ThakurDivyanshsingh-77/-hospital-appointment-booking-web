import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, MessageSquareQuote, ShieldCheck, Star, Users } from "lucide-react";

const stories = [
  {
    name: "Anita Desai",
    category: "Cardiac Surgery",
    rating: 5,
    quote:
      "The care I received at MediCare was exceptional. The doctors were professional and the nursing team kept my family informed at every step.",
    outcome: "Recovered and resumed routine activities within 8 weeks.",
  },
  {
    name: "Vikram Singh",
    category: "Orthopedics",
    rating: 5,
    quote:
      "From diagnosis to physiotherapy follow-up, everything was organized and smooth. The team made recovery much less stressful.",
    outcome: "Post-knee replacement mobility improved significantly.",
  },
  {
    name: "Meera Joshi",
    category: "Pediatrics",
    rating: 5,
    quote:
      "The pediatric doctors were kind, patient, and very detailed. They explained treatment clearly and made my daughter feel comfortable.",
    outcome: "Condition stabilized with strong follow-up care plan.",
  },
  {
    name: "Rakesh Menon",
    category: "Emergency Care",
    rating: 5,
    quote:
      "Emergency response was quick and coordinated. We were guided right from admission till discharge without confusion.",
    outcome: "Timely intervention prevented further complications.",
  },
];

const trustPoints = [
  { value: "4.9/5", label: "Average patient rating" },
  { value: "2k+", label: "Feedback entries reviewed" },
  { value: "96%", label: "Positive care experience" },
];

const qualityCommitments = [
  {
    icon: ShieldCheck,
    title: "Verified Submissions",
    detail: "Feedback is reviewed by our quality team before publication and action planning.",
  },
  {
    icon: Users,
    title: "Patient-First Follow-Up",
    detail: "Concerns are routed to care coordinators for faster response and resolution.",
  },
  {
    icon: CircleCheck,
    title: "Continuous Improvement",
    detail: "Real patient insights help us improve communication, safety, and service quality.",
  },
];

const TestimonialsPage = () => {
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
                <Badge className="border border-white/20 bg-white/10 text-white hover:bg-white/10">Testimonials</Badge>
                <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">What Patients Say About MediCare</h1>
                <p className="mt-4 max-w-2xl text-white/80">
                  Honest experiences from patients and families across specialties. These stories help us improve
                  outcomes and service quality every day.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/feedback">
                    <Button className="gap-2 bg-white text-hospital-navy hover:bg-white/90">
                      Share Your Feedback <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/appointment">
                    <Button
                      variant="outline"
                      className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-primary/20 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Patient Trust Snapshot</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {trustPoints.map((point) => (
                  <div key={point.label} className="rounded-xl border bg-card p-4">
                    <p className="text-2xl font-bold text-foreground">{point.value}</p>
                    <p className="text-xs text-muted-foreground">{point.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border bg-muted/40 p-4">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <MessageSquareQuote className="h-3.5 w-3.5" />
                  Listening Desk
                </div>
                <p className="text-sm text-muted-foreground">
                  Every testimonial and complaint is reviewed by our patient relations and quality teams.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="container">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Patient Stories</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">Real Experiences</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {stories.map((story) => (
              <Card key={story.name} className="rounded-2xl border-l-4 border-l-primary p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{story.name}</p>
                    <p className="text-xs text-muted-foreground">{story.category}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: story.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-hospital-warning text-hospital-warning" />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">"{story.quote}"</p>
                <p className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary">{story.outcome}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container pt-10">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Quality Loop</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">How Feedback Improves Care</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {qualityCommitments.map((item) => (
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

export default TestimonialsPage;
