import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">M</span>
              </div>
              <span className="text-lg font-bold">MediCare</span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              Providing world-class healthcare services with compassion and excellence since 1995.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm opacity-70">
              {["About Us", "Departments", "Doctors", "Appointment", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="transition-opacity hover:opacity-100"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Departments</h4>
            <ul className="space-y-2.5 text-sm opacity-70">
              {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology"].map((d) => (
                <li key={d}>
                  <Link to="/departments" className="transition-opacity hover:opacity-100">
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                123 Medical Center Drive, Healthcare City, HC 10001
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                +1 (800) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                info@medicare-hospital.com
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                Mon - Sat: 8:00 AM - 8:00 PM
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs opacity-50 md:flex-row">
          <span>© 2026 MediCare Hospital. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
