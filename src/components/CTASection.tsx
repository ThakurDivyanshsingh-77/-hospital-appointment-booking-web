import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="pb-20 pt-12">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-hospital-navy px-6 py-10 text-center text-white md:px-10 md:py-12 md:text-left">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/15" />
          <div className="absolute -bottom-24 -left-8 h-56 w-56 rounded-full bg-primary/35 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Need Emergency Medical Care?</h2>
              <p className="mt-2 text-white/75">
                Our emergency and critical care units are active 24/7. Reach out immediately for urgent help.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/appointment">
                <Button size="lg" className="gap-2 bg-white text-hospital-navy hover:bg-white/90">
                  Book Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+18001234567">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
