"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./views/Index";
import AboutPage from "./views/AboutPage";
import DepartmentsPage from "./views/DepartmentsPage";
import DoctorsPage from "./views/DoctorsPage";
import AppointmentPage from "./views/AppointmentPage";
import ContactPage from "./views/ContactPage";
import LoginPage from "./views/LoginPage";
import FeedbackPage from "./views/FeedbackPage";
import DirectorsDeskPage from "./views/DirectorsDeskPage";
import PatientCornerPage from "./views/PatientCornerPage";
import AcademicsPage from "./views/AcademicsPage";
import CareersPage from "./views/CareersPage";
import GalleryPage from "./views/GalleryPage";
import HealthPackagesPage from "./views/HealthPackagesPage";
import TestimonialsPage from "./views/TestimonialsPage";
import AdminDashboard from "./views/admin/AdminDashboard";
import AdminDoctors from "./views/admin/AdminDoctors";
import AdminAppointments from "./views/admin/AdminAppointments";
import AdminDepartments from "./views/admin/AdminDepartments";
import AdminGallery from "./views/admin/AdminGallery";
import {
  AdminPatientsPage,
  AdminReportsPage,
  AdminSettingsPage,
} from "./views/admin/AdminPlaceholderPages";
import PatientDashboard from "./views/patient/PatientDashboard";
import BookAppointment from "./views/patient/BookAppointment";
import PatientAppointments from "./views/patient/PatientAppointments";
import {
  HealthRecordsPage,
  PrescriptionsPage,
  MessagesPage,
  ProfilePage,
  SettingsPage,
} from "./views/patient/PatientPlaceholderPages";
import DoctorDashboard from "./views/doctor/DoctorDashboard";
import DoctorAppointments from "./views/doctor/DoctorAppointments";
import DoctorAvailability from "./views/doctor/DoctorAvailability";
import DoctorPatients from "./views/doctor/DoctorPatients";
import DoctorProfile from "./views/doctor/DoctorProfile";
import DoctorSettings from "./views/doctor/DoctorSettings";
import NotFound from "./views/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/directors-desk" element={<DirectorsDeskPage />} />
            <Route path="/patient-corner" element={<PatientCornerPage />} />
            <Route path="/academics" element={<AcademicsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/health-packages" element={<HealthPackagesPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/doctors" element={<ProtectedRoute requiredRole="admin"><AdminDoctors /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute requiredRole="admin"><AdminAppointments /></ProtectedRoute>} />
            <Route path="/admin/departments" element={<ProtectedRoute requiredRole="admin"><AdminDepartments /></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute requiredRole="admin"><AdminGallery /></ProtectedRoute>} />
            <Route path="/admin/patients" element={<ProtectedRoute requiredRole="admin"><AdminPatientsPage /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><AdminReportsPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettingsPage /></ProtectedRoute>} />
            {/* Doctor routes */}
            <Route path="/doctor" element={<ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/appointments" element={<ProtectedRoute requiredRole="doctor"><DoctorAppointments /></ProtectedRoute>} />
            <Route path="/doctor/availability" element={<ProtectedRoute requiredRole="doctor"><DoctorAvailability /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute requiredRole="doctor"><DoctorPatients /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute requiredRole="doctor"><DoctorProfile /></ProtectedRoute>} />
            <Route path="/doctor/settings" element={<ProtectedRoute requiredRole="doctor"><DoctorSettings /></ProtectedRoute>} />
            {/* Patient routes */}
            <Route path="/patient" element={<ProtectedRoute requiredRole="patient"><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patient/book" element={<ProtectedRoute requiredRole="patient"><BookAppointment /></ProtectedRoute>} />
            <Route path="/patient/appointments" element={<ProtectedRoute requiredRole="patient"><PatientAppointments /></ProtectedRoute>} />
            <Route path="/patient/records" element={<ProtectedRoute requiredRole="patient"><HealthRecordsPage /></ProtectedRoute>} />
            <Route path="/patient/prescriptions" element={<ProtectedRoute requiredRole="patient"><PrescriptionsPage /></ProtectedRoute>} />
            <Route path="/patient/messages" element={<ProtectedRoute requiredRole="patient"><MessagesPage /></ProtectedRoute>} />
            <Route path="/patient/profile" element={<ProtectedRoute requiredRole="patient"><ProfilePage /></ProtectedRoute>} />
            <Route path="/patient/settings" element={<ProtectedRoute requiredRole="patient"><SettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
