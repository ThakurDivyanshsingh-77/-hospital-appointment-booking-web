import { Link } from "react-router-dom";
import { ArrowRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Anita Desai",
    text: "The care I received at MediCare was exceptional. The doctors were professional and the staff was incredibly supportive throughout my treatment.",
    rating: 5,
    treatment: "Cardiac Surgery",
  },
  {
    name: "Vikram Singh",
    text: "Highly recommend MediCare for orthopedic treatment. Dr. Patel performed my knee replacement surgery and the recovery was smooth.",
    rating: 5,
    treatment: "Knee Replacement",
  },
  {
    name: "Meera Joshi",
    text: "The pediatric department took amazing care of my daughter. The doctors were patient, kind, and very thorough in their examination.",
    rating: 5,
    treatment: "Pediatric Care",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-secondary/35 py-20">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">What Our Patients Say</h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Verified experiences from patients and families who trusted us with their care journey.
            </p>
          </div>
          <Link to="/testimonials" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              View All Stories <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border bg-card p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-hospital-warning text-hospital-warning" />
                  ))}
                </div>
                <Quote className="h-4 w-4 text-primary/70" />
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.treatment}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/testimonials">
            <Button variant="outline" className="gap-2">
              View All Stories <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
