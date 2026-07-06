import { Award, Building2, HeartPulse, Users2 } from "lucide-react";

const stats = [
  { icon: Users2, value: "200+", label: "Expert Doctors" },
  { icon: HeartPulse, value: "50K+", label: "Patients Served" },
  { icon: Building2, value: "30+", label: "Clinical Departments" },
  { icon: Award, value: "25+", label: "Years of Excellence" },
];

const StatsSection = () => {
  return (
    <section className="py-10">
      <div className="container grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5 text-center shadow-card">
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground md:text-4xl">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
