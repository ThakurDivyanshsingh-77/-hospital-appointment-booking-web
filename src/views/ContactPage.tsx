import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Clock3, Mail, MapPin, Phone, Send, ShieldCheck } from "lucide-react";

const contactCards = [
  { icon: Phone, title: "Phone", text: "+1 (800) 123-4567", subtext: "Emergency & helpdesk" },
  { icon: Mail, title: "Email", text: "care@medicare.com", subtext: "Patient support and queries" },
  { icon: MapPin, title: "Address", text: "123 Medical Center Drive, Healthcare City, HC 10001", subtext: "Main Campus" },
  { icon: Clock3, title: "Hours", text: "Mon - Sat: 8:00 AM - 8:00 PM", subtext: "Emergency open 24/7" },
];

const helpPoints = [
  "Appointment and specialist booking guidance",
  "Insurance, TPA, and billing support details",
  "Department-wise contact and visit coordination",
  "Feedback and patient relations assistance",
];

const ContactPage = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message sent! We'll get back to you shortly.");
    }, 600);
  };

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
                <Badge className="border border-white/20 bg-white/10 text-white hover:bg-white/10">Contact</Badge>
                <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Get in Touch With Our Care Team</h1>
                <p className="mt-4 max-w-2xl text-white/80">
                  Have questions about appointments, insurance, or treatment pathways? Reach out and our team will
                  guide you quickly.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="tel:+18001234567">
                    <Button className="bg-white text-hospital-navy hover:bg-white/90">Call Now</Button>
                  </a>
                  <a href="mailto:care@medicare.com">
                    <Button
                      variant="outline"
                      className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      Email Us
                    </Button>
                  </a>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-primary/20 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">How We Can Help</p>
              <div className="mt-4 space-y-3">
                {helpPoints.map((item) => (
                  <div key={item} className="rounded-xl border bg-card px-3 py-2.5 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border bg-muted/40 p-4">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Response Promise
                </div>
                <p className="text-sm text-muted-foreground">Most enquiries are answered within one business day.</p>
              </div>
            </Card>
          </div>
        </section>

        <section className="container">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {contactCards.map((item) => (
              <Card key={item.title} className="rounded-2xl p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.subtext}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container pt-10">
          <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
            <Card className="rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-foreground">Send Us a Message</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fill the form and our team will contact you soon.</p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">Full Name</Label>
                    <Input id="contact-name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input id="contact-subject" placeholder="How can we help?" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea id="contact-message" placeholder="Your message..." rows={6} required />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={submitting}>
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>

            <Card className="rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-foreground">Visit the Hospital</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our campus is easy to access and open for OPD consultations from Monday to Saturday.
              </p>

              <div className="mt-4 overflow-hidden rounded-xl border">
                <iframe
                  title="MediCare Hospital Location"
                  src="https://maps.google.com/maps?q=New%20York%20Medical%20Center&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Address:</span> 123 Medical Center Drive, Healthcare City, HC 10001</p>
                <p><span className="font-medium text-foreground">Parking:</span> Basement and visitor parking available</p>
                <p><span className="font-medium text-foreground">Emergency:</span> Open 24/7</p>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
