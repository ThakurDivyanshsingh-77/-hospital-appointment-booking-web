import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import { imageSrc } from "@/lib/image";

const doctors = [
  { name: "Dr. Rajesh Kumar", specialty: "Cardiologist", exp: "15+ Years", image: doctor1 },
  { name: "Dr. Priya Sharma", specialty: "Neurologist", exp: "12+ Years", image: doctor2 },
  { name: "Dr. Amit Patel", specialty: "Orthopedic Surgeon", exp: "10+ Years", image: doctor3 },
];

const DoctorsSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Expert Team</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Our Specialists</h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Meet experienced consultants delivering personalized care across core medical specialties.
            </p>
          </div>
          <Link to="/doctors" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <div key={doc.name} className="group overflow-hidden rounded-2xl border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={imageSrc(doc.image)}
                  alt={doc.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground">{doc.name}</h3>
                <p className="text-sm text-primary">{doc.specialty}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{doc.exp} Experience</Badge>
                  <Link to="/appointment" className="text-xs font-semibold text-primary hover:underline">
                    Book Visit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/doctors">
            <Button variant="outline" className="gap-2">
              View All Doctors <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
