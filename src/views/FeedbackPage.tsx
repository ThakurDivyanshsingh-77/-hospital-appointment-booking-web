import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Clock3, Loader2, MailCheck, MessageSquareHeart, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

const trustPoints = [
  {
    icon: MailCheck,
    title: "Direct to Team",
    detail: "Every submission is sent to our support desk email in real time.",
  },
  {
    icon: Clock3,
    title: "Quick Review",
    detail: "Priority concerns are reviewed first by patient relations staff.",
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    detail: "Your shared details are used only for care quality follow-up.",
  },
];

const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiRequest("/public/feedback", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          phone,
          message,
        }),
      });

      setSubmitted(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 3000);
      toast.success("Feedback submitted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-14">
        <section className="container py-10 md:py-12">
          <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
            <Card className="relative overflow-hidden rounded-3xl border-0 bg-hospital-navy p-6 text-white md:p-8">
              <div className="absolute -right-16 top-0 h-40 w-40 rounded-full border border-white/15" />
              <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-primary/30 blur-3xl" />

              <div className="relative">
                <Badge className="border border-white/20 bg-white/10 text-white hover:bg-white/10">Feedback</Badge>
                <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">We Value Your Experience</h1>
                <p className="mt-4 max-w-2xl text-white/80">
                  Share your visit experience, suggestions, or concerns. Your feedback helps us improve care quality
                  and patient support.
                </p>

                <div className="mt-6 rounded-xl border border-white/20 bg-white/10 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-white">
                    <MessageSquareHeart className="h-4 w-4" />
                    Patient Listening Desk
                  </div>
                  <p className="text-sm text-white/75">
                    We read every message and route important issues to the right clinical or support team.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-primary/20 p-6">
              {submitted && (
                <div className="mb-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
                  Thank you! Your feedback has been received and emailed to our team.
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="feedback-fullname">Full Name</Label>
                    <Input
                      id="feedback-fullname"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      maxLength={120}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="feedback-email">Email</Label>
                    <Input
                      id="feedback-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="feedback-phone">Phone (Optional)</Label>
                  <Input
                    id="feedback-phone"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={30}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="feedback-message">Your Feedback</Label>
                    <span className="text-xs text-muted-foreground">{message.length}/3000</span>
                  </div>
                  <Textarea
                    id="feedback-message"
                    placeholder="Tell us about your experience..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    minLength={10}
                    maxLength={3000}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </section>

        <section className="container">
          <div className="grid gap-4 md:grid-cols-3">
            {trustPoints.map((item) => (
              <Card key={item.title} className="rounded-2xl p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
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

export default FeedbackPage;
