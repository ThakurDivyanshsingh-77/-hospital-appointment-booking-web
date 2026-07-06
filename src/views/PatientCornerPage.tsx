import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CircleHelp, ClipboardCheck, FileCheck2, PhoneCall, ShieldCheck } from "lucide-react";

const tpaPartners = ["MediAssist", "FHPL", "Paramount", "HDFC Ergo", "ICICI Lombard"];

const supportServices = [
  {
    icon: ShieldCheck,
    title: "Eligibility Verification",
    detail: "Fast policy and cashless eligibility checks before admission.",
  },
  {
    icon: FileCheck2,
    title: "Pre-Authorization Support",
    detail: "Coordination with insurer/TPA for approvals and documentation.",
  },
  {
    icon: ClipboardCheck,
    title: "Claim Documentation",
    detail: "Guidance on documents for cashless and reimbursement claims.",
  },
];

const claimFlow = [
  { step: "Step 1", title: "Register at Insurance Desk", detail: "Share insurance card, ID, and admission advice." },
  { step: "Step 2", title: "Verification + Pre-Auth", detail: "Our desk verifies policy and submits pre-auth request." },
  { step: "Step 3", title: "Treatment & Updates", detail: "Care continues while claim status is monitored." },
  { step: "Step 4", title: "Discharge & Settlement", detail: "Final documents are processed for settlement support." },
];

const documentGroups = [
  {
    title: "At Admission",
    items: [
      "Insurance card and patient photo ID",
      "Doctor consultation notes / admission advice",
      "Policy number, TPA details, and employer card (if applicable)",
    ],
  },
  {
    title: "During Discharge",
    items: [
      "All test reports and prescriptions",
      "Final bill summary and pharmacy bills",
      "Signed claim forms and discharge summary",
    ],
  },
];

const faqs = [
  {
    q: "How much time does cashless approval take?",
    a: "Typical pre-authorization is processed in a few hours, depending on insurer response.",
  },
  {
    q: "Can I file reimbursement if cashless is denied?",
    a: "Yes. Our team shares the complete reimbursement checklist and helps with submission.",
  },
  {
    q: "Do you help with post-discharge claim queries?",
    a: "Yes, the patient helpdesk supports follow-up documentation and insurer clarifications.",
  },
];

const PatientCornerPage = () => {
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
                <Badge className="border border-white/20 bg-white/10 text-white hover:bg-white/10">Patient Corner</Badge>
                <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Insurance & TPA Helpdesk</h1>
                <p className="mt-4 max-w-2xl text-white/80">
                  Dedicated support to simplify cashless approvals, reimbursement claims, and policy documentation for
                  patients and families.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/appointment">
                    <Button className="gap-2 bg-white text-hospital-navy hover:bg-white/90">
                      Start Appointment <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      Contact Helpdesk
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-primary/20 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our TPA Network</p>
              <p className="mt-1 text-sm text-muted-foreground">Major partners for smoother cashless processing.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tpaPartners.map((name) => (
                  <Badge key={name} variant="secondary" className="px-3 py-1 text-sm">
                    {name}
                  </Badge>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border bg-card p-4">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <PhoneCall className="h-3.5 w-3.5" />
                  Helpdesk Support
                </div>
                <p className="text-sm text-muted-foreground">
                  Insurance Desk: Mon-Sat, 8:00 AM to 8:00 PM
                  <br />
                  Phone: +1 (800) 123-4567
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="container">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How We Help</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">Support Services</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {supportServices.map((item) => (
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
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Cashless Journey</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">Claim Flow</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {claimFlow.map((item) => (
              <Card key={item.step} className="rounded-2xl border-l-4 border-l-primary p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{item.step}</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container pt-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card className="rounded-2xl p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Documents Checklist</p>
              <div className="mt-4 space-y-4">
                {documentGroups.map((group) => (
                  <div key={group.title} className="rounded-xl border bg-card p-4">
                    <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <CircleHelp className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-wider">Frequently Asked Questions</p>
              </div>
              <div className="space-y-3">
                {faqs.map((item) => (
                  <div key={item.q} className="rounded-xl border bg-card p-4">
                    <h3 className="text-sm font-semibold text-foreground">{item.q}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
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

export default PatientCornerPage;
