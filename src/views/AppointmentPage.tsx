import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarPlus, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AppointmentPage = () => {
  const { user, role } = useAuth();

  const getActionPath = () => {
    if (!user) return "/login";
    if (role === "patient") return "/patient/book";
    if (role === "doctor") return "/doctor";
    return "/admin";
  };

  const getActionLabel = () => {
    if (!user) return "Sign In to Book";
    if (role === "patient") return "Book Appointment";
    if (role === "doctor") return "Go to Doctor Dashboard";
    return "Go to Admin Dashboard";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="bg-secondary py-16">
          <div className="container">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Appointment</p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Book an Appointment</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Appointments are now managed from the patient portal. Sign in to choose a department, doctor, date, and
              available slot in real time.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-2xl">
            <Card className="p-10 text-center shadow-card">
              <CalendarPlus className="mx-auto mb-4 h-14 w-14 text-primary" />
              <h2 className="mb-2 text-2xl font-bold text-foreground">Use the Patient Booking Portal</h2>
              <p className="mb-8 text-muted-foreground">
                Browse doctors, see live availability, and submit appointment requests directly from your account.
              </p>
              <Link to={getActionPath()}>
                <Button size="lg" className="gap-2">
                  {!user && <LogIn className="h-4 w-4" />}
                  {getActionLabel()}
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentPage;
