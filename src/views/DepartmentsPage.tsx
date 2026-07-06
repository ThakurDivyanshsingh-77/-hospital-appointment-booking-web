import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, Baby, Bone, Brain, Eye, Heart, Stethoscope, Syringe } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Department {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

const iconMap: Record<string, typeof Heart> = {
  Heart,
  Brain,
  Bone,
  Baby,
  Stethoscope,
  Eye,
  Syringe,
  Activity,
};

const toAnchorId = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const departmentImages: Record<string, string> = {
  cardiology: "/cardiology.png",
  pulmonology: "/pulmonology.png",
  neurology: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600",
  orthopedics: "/orthopedic.png",
  pediatrics: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600",
  ophthalmology: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
  "critical-care": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
  nephrology: "/nephrology.png",
  generalMedicine: "/general_medicine.png",
  dermatology: "/dermatology.png",
  emergency: "/emergency_medicine.png",
  default: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600"
};

const getDepartmentImage = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("cardio")) return departmentImages.cardiology;
  if (normalized.includes("pulmono") || normalized.includes("lung") || normalized.includes("respirat")) return departmentImages.pulmonology;
  if (normalized.includes("neuro")) return departmentImages.neurology;
  if (normalized.includes("ortho") || normalized.includes("bone")) return departmentImages.orthopedics;
  if (normalized.includes("pediatr") || normalized.includes("baby") || normalized.includes("child")) return departmentImages.pediatrics;
  if (normalized.includes("eye") || normalized.includes("ophthalmology")) return departmentImages.ophthalmology;
  if (normalized.includes("critical") || normalized.includes("icu") || normalized.includes("care")) return departmentImages["critical-care"];
  if (normalized.includes("kidney") || normalized.includes("nephro") || normalized.includes("uro") || normalized.includes("renal")) return departmentImages.nephrology;
  if (normalized.includes("general") || normalized.includes("medicine") || normalized.includes("stethoscope")) return departmentImages.generalMedicine;
  if (normalized.includes("derma") || normalized.includes("skin") || normalized.includes("syringe")) return departmentImages.dermatology;
  if (normalized.includes("emergenc") || normalized.includes("trauma")) return departmentImages.emergency;
  return departmentImages.default;
};

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiRequest<{ departments: Department[] }>("/public/departments");
        setDepartments(response.departments || []);
      } catch {
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments().catch(() => {
      setDepartments([]);
      setIsLoading(false);
    });
  }, []);

  const withAnchors = useMemo(
    () =>
      departments.map((department) => ({
        ...department,
        anchor: toAnchorId(department.name),
      })),
    [departments],
  );

  useEffect(() => {
    if (!location.hash || withAnchors.length === 0) {
      return;
    }
    const hashId = location.hash.replace("#", "");
    const target = document.getElementById(hashId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, withAnchors]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-14">
        <section className="container py-10 md:py-12">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <Card className="relative overflow-hidden rounded-3xl border-0 bg-hospital-navy p-6 text-white md:p-8">
              <div className="absolute -right-16 -top-10 h-40 w-40 rounded-full border border-white/15" />
              <div className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-primary/30 blur-3xl" />

              <div className="relative">
                <Badge className="border border-white/20 bg-white/10 text-white hover:bg-white/10">Departments</Badge>
                <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Specialities Built Around Patient Needs</h1>
                <p className="mt-4 max-w-2xl text-white/80">
                  Explore our medical departments with dedicated teams, advanced diagnostics, and outcome-focused
                  treatment pathways.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                    <p className="text-xl font-bold">{withAnchors.length || "8+"}</p>
                    <p className="text-xs text-white/70">Active specialities</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                    <p className="text-xl font-bold">24/7</p>
                    <p className="text-xs text-white/70">Emergency coverage</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                    <p className="text-xl font-bold">1 Team</p>
                    <p className="text-xs text-white/70">Integrated care model</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to="/appointment">
                    <Button className="gap-2 bg-white text-hospital-navy hover:bg-white/90">
                      Book Specialist Visit <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-primary/20 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Department Directory</p>
              <p className="mt-1 text-sm text-muted-foreground">Quick jump to any specialty section.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {withAnchors.slice(0, 8).map((department) => (
                  <a
                    key={department.id}
                    href={`#${department.anchor}`}
                    className="rounded-xl border bg-card px-3 py-2 text-sm text-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    {department.name}
                  </a>
                ))}
                {!isLoading && withAnchors.length === 0 && (
                  <p className="rounded-xl border bg-card px-3 py-2 text-sm text-muted-foreground">No departments found.</p>
                )}
              </div>
            </Card>
          </div>
        </section>

        <section className="container">
          <div className="mb-5 flex flex-wrap gap-2">
            {withAnchors.map((department) => (
              <a
                key={`${department.id}-chip`}
                href={`#${department.anchor}`}
                className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                {department.name}
              </a>
            ))}
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse rounded-3xl p-6 flex flex-col items-center">
                  <div className="w-full aspect-[4/3] rounded-tl-[100px] rounded-br-[100px] bg-muted mb-6" />
                  <div className="h-4 w-28 rounded bg-muted mb-3" />
                  <div className="h-3 w-full rounded bg-muted mb-2" />
                  <div className="h-3 w-4/5 rounded bg-muted mb-6" />
                  <div className="h-10 w-32 rounded-full bg-muted" />
                </Card>
              ))}
            </div>
          ) : withAnchors.length === 0 ? (
            <Card className="rounded-2xl p-8 text-center">
              <p className="text-muted-foreground">No active departments available right now.</p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {withAnchors.map((department) => {
                return (
                  <Card
                    id={department.anchor}
                    key={department.id}
                    className="scroll-mt-24 rounded-[32px] border border-slate-100 bg-white p-6 text-center shadow-md hover:shadow-lg transition flex flex-col justify-between items-center"
                  >
                    <div className="w-full flex flex-col items-center">
                      {/* Leaf Shape Image Container */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0e386c] p-1.5 rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] shadow-sm mb-6">
                        <img
                          src={getDepartmentImage(department.name)}
                          alt={department.name}
                          className="w-full h-full object-cover rounded-tl-[95px] rounded-br-[95px] rounded-tr-[8px] rounded-bl-[8px]"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{department.name}</h3>
                      <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                        {department.description || "Explore specialized medical services tailored to your health needs."}
                      </p>
                    </div>

                    <div className="mt-6 w-full">
                      <Link to="/appointment">
                        <Button className="w-full sm:w-auto bg-[#0e386c] hover:bg-[#0b2c55] text-white px-8 py-2 rounded-full font-semibold transition-colors">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DepartmentsPage;
