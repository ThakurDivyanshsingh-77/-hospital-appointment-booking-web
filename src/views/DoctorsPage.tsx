import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import { apiRequest } from "@/lib/api";
import { imageSrc } from "@/lib/image";

interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
}

const fallbackImages = [doctor1, doctor2, doctor3];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await apiRequest<{ doctors: Doctor[] }>("/public/doctors");
      setDoctors(response.doctors || []);
    };
    fetchDoctors().catch(() => setDoctors([]));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="bg-secondary py-16">
          <div className="container">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Our Team</p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Meet Our Doctors</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Our team of highly qualified specialists is dedicated to providing the best healthcare outcomes.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            {doctors.length === 0 ? (
              <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                No active doctors available right now.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor, index) => (
                  <div
                    key={doctor.id}
                    className="group overflow-hidden rounded-xl border bg-card shadow-card transition-shadow hover:shadow-card-hover"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={imageSrc(fallbackImages[index % fallbackImages.length])}
                        alt={doctor.fullName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground">{doctor.fullName}</h3>
                      <p className="text-sm font-medium text-primary">{doctor.specialty}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{doctor.qualification || "General Practice"}</p>
                      <p className="text-xs text-muted-foreground">{doctor.experienceYears || 0}+ Years Experience</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorsPage;
