import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, ChevronDown, Mail, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavChildLink = {
  label: string;
  path: string;
  description?: string;
};

type NavLink = {
  label: string;
  path: string;
  menuHint?: string;
  children?: NavChildLink[];
};

const navLinks: NavLink[] = [
  { label: "Home", path: "/" },
  {
    label: "About Us",
    path: "/about",
    menuHint: "Know our mission and leadership team",
    children: [
      { label: "About", path: "/about", description: "Hospital overview and values" },
      { label: "Director's Desk", path: "/directors-desk", description: "Message from leadership" },
      { label: "Academics", path: "/academics", description: "Training and learning programs" },
      { label: "Careers", path: "/careers", description: "Current opportunities and hiring" },
    ],
  },
  {
    label: "Departments",
    path: "/departments",
    menuHint: "Explore core specialties and clinics",
    children: [
      { label: "Cardiology", path: "/departments#cardiology", description: "Heart and vascular care" },
      { label: "Neurology", path: "/departments#neurology", description: "Brain and nerve care" },
      { label: "Orthopedics", path: "/departments#orthopedics", description: "Bones, joints, and spine" },
      { label: "Pediatrics", path: "/departments#pediatrics", description: "Care for infants and children" },
      { label: "View All", path: "/departments", description: "See every department" },
    ],
  },
  { label: "Doctors", path: "/doctors" },
  {
    label: "Patient Services",
    path: "/patient-corner",
    menuHint: "Plan your visit and check support options",
    children: [
      { label: "Patient Corner", path: "/patient-corner", description: "Guides, policies, and help desk" },
      { label: "Health Packages", path: "/health-packages", description: "Preventive and wellness plans" },
      { label: "Testimonials", path: "/testimonials", description: "Patient stories and experiences" },
    ],
  },
  {
    label: "Resources/Media",
    path: "/gallery",
    menuHint: "Media, visuals, and public feedback",
    children: [
      { label: "Gallery", path: "/gallery", description: "Campus and event highlights" },
      { label: "Feedback", path: "/feedback", description: "Share your experience with us" },
    ],
  },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const location = useLocation();
  const desktopNavRef = useRef<HTMLElement | null>(null);

  const normalizePath = (path: string) => path.split("#")[0];
  const isActive = (path: string) => location.pathname === normalizePath(path);
  const isLinkActive = (link: NavLink) =>
    isActive(link.path) || (link.children?.some((child) => isActive(child.path)) ?? false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    setDropdownOpen(null);
  }, [location.pathname, location.hash]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileDropdownOpen(null);
  };

  const renderLink = (link: NavLink) => {
    if (!link.children) {
      return (
        <Link
          key={link.label}
          to={link.path}
          className={`flex items-center rounded-full px-3.5 py-2 text-sm font-medium transition ${
            isLinkActive(link)
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          {link.label}
        </Link>
      );
    }

    const isOpen = dropdownOpen === link.label;

    return (
      <div
        key={link.label}
        className="relative"
        onMouseEnter={() => setDropdownOpen(link.label)}
        onMouseLeave={() => setDropdownOpen(null)}
      >
        <button
          type="button"
          onClick={() => setDropdownOpen(isOpen ? null : link.label)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition ${
            isLinkActive(link)
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <span>{link.label}</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <div
          className={`absolute left-1/2 top-full z-30 w-[24rem] -translate-x-1/2 pt-2 transition-all duration-200 ${
            isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-2xl border bg-background shadow-xl">
            <div className="border-b bg-muted/40 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{link.label}</p>
              {link.menuHint && <p className="text-xs text-muted-foreground">{link.menuHint}</p>}
            </div>
            <div className="p-2">
              {link.children.map((child) => (
                <Link
                  key={child.label}
                  to={child.path}
                  onClick={() => setDropdownOpen(null)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                    isActive(child.path) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-medium">{child.label}</span>
                    {child.description && <span className="block text-xs text-muted-foreground">{child.description}</span>}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-xs md:text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Emergency: +1 (800) 123-4567
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              care@medicare.com
            </span>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
            <Link to="/appointment">
              <Button size="sm" variant="secondary" className="rounded-full">Book Now</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 shadow-sm">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              M
            </div>
            <div className="leading-tight">
              <span className="text-lg font-semibold text-foreground">MediCare</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Multi-Speciality Hospital
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav ref={desktopNavRef} className="hidden items-center gap-2 lg:flex">
            {navLinks.map(renderLink)}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full">Login</Button>
            </Link>
            <Link to="/appointment">
              <Button size="sm" className="rounded-full">Book Appointment</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden rounded-lg border p-2"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              if (mobileOpen) {
                setMobileDropdownOpen(null);
              }
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="border-t bg-background lg:hidden">
            <nav className="container flex flex-col gap-1 py-4">
              {navLinks.map((link) => {
                if (!link.children) {
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={`rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-accent ${
                        isActive(link.path) ? "bg-primary text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                }

                const isOpen = mobileDropdownOpen === link.label;

                return (
                  <div key={link.label} className="overflow-hidden rounded-2xl border bg-card/40 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setMobileDropdownOpen(isOpen ? null : link.label)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between px-3 py-2.5 text-left transition hover:bg-accent ${
                        isLinkActive(link) ? "bg-primary text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      <span className="leading-tight">
                        <span className="block text-sm font-medium">{link.label}</span>
                        {link.menuHint && <span className="block text-xs opacity-80">{link.menuHint}</span>}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="space-y-1.5 border-t bg-muted/20 px-2 py-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.path}
                            onClick={closeMobileMenu}
                            className={`flex items-center justify-between rounded-lg px-2.5 py-2 transition hover:bg-accent ${
                              isActive(child.path) ? "bg-primary/10 text-primary" : "text-foreground"
                            }`}
                          >
                            <span>
                              <span className="block text-sm font-medium">{child.label}</span>
                              {child.description && <span className="block text-xs text-muted-foreground">{child.description}</span>}
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full rounded-full">Login</Button>
                </Link>
                <Link to="/appointment" className="flex-1" onClick={closeMobileMenu}>
                  <Button className="w-full rounded-full">Book</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
