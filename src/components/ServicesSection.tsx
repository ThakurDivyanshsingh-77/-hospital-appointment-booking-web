import { Link } from "react-router-dom";
import { ArrowRight, Baby, Bone, Brain, Eye, Heart, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Heart, title: "Cardiology", desc: "Advanced cardiac care with state-of-the-art catheterization lab." },
  { icon: Brain, title: "Neurology", desc: "Comprehensive neurological diagnosis and treatment services." },
  { icon: Bone, title: "Orthopedics", desc: "Joint replacement, spine surgery, and sports medicine." },
  { icon: Baby, title: "Pediatrics", desc: "Complete child healthcare from newborns to adolescents." },
  { icon: Stethoscope, title: "General Medicine", desc: "Primary care and preventive health check-ups." },
  { icon: Eye, title: "Ophthalmology", desc: "Advanced eye care including LASIK and cataract surgery." },
];

const ServicesSection = () => {
  return (
    <section className="bg-secondary/40 py-20">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Our Departments</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Specialized Healthcare</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Department-led care with specialists, diagnostics, and treatment pathways under one roof.
            </p>
          </div>
          <Link to="/departments">
            <Button variant="outline" className="gap-2">
              View All Departments <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{service.desc}</p>
              <Link
                to="/departments"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition group-hover:gap-2"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
