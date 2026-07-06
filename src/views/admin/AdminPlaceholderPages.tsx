import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Users, FileText, Settings } from "lucide-react";

export const AdminPatientsPage = () => {
  return (
    <AdminLayout title="Patients" subtitle="Patient registration and record management">
      <Card className="border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-violet-600" />
          Patient Directory
        </h2>
        <p className="text-sm text-slate-500">Manage patient records, access histories, and patient account controls.</p>
      </Card>
    </AdminLayout>
  );
};

export const AdminReportsPage = () => {
  return (
    <AdminLayout title="Reports" subtitle="System usage, financials, and analytical performance logs">
      <Card className="border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-violet-600" />
          Analytics & Insights
        </h2>
        <p className="text-sm text-slate-500">Generate, view, and export operational reports for clinics, doctors, and user sign-ups.</p>
      </Card>
    </AdminLayout>
  );
};

export const AdminSettingsPage = () => {
  return (
    <AdminLayout title="Settings" subtitle="CareConnect system settings and configuration details">
      <Card className="border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-violet-600" />
          System Configuration
        </h2>
        <p className="text-sm text-slate-500">Configure appointment intervals, doctor profiles, notification channels, and global variables.</p>
      </Card>
    </AdminLayout>
  );
};
