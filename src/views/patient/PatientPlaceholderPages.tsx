import PatientLayout from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Pill, 
  MessageSquare, 
  User, 
  Settings as SettingsIcon, 
  Download, 
  Eye, 
  Send 
} from "lucide-react";

export const HealthRecordsPage = () => {
  const records = [
    { id: "1", name: "Blood Report - Annual Checkup", date: "May 20, 2026", type: "Lab Report", size: "2.4 MB" },
    { id: "2", name: "Cardiology Consultation Summary", date: "April 12, 2026", type: "Clinical Summary", size: "1.1 MB" },
    { id: "3", name: "Vaccination Record", date: "Jan 15, 2026", type: "Immunization", size: "850 KB" },
  ];

  return (
    <PatientLayout title="Health Records" subtitle="Access your medical documents, lab results, and reports">
      <Card className="border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-violet-600" />
          My Medical Documents
        </h2>
        <div className="divide-y divide-slate-100">
          {records.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div>
                <p className="font-medium text-slate-950">{doc.name}</p>
                <p className="text-xs text-slate-500">{doc.type} • {doc.date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1 text-slate-600">
                  <Eye className="h-3.5 w-3.5" /> View
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-violet-700 hover:text-violet-800 border-violet-200 hover:bg-violet-50">
                  <Download className="h-3.5 w-3.5" /> Download ({doc.size})
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PatientLayout>
  );
};

export const PrescriptionsPage = () => {
  const prescriptions = [
    { id: "1", name: "Atorvastatin 20mg", dosage: "1 tablet daily", duration: "3 months", doctor: "Dr. Divyansh Singh", active: true },
    { id: "2", name: "Lisinopril 10mg", dosage: "1 tablet in morning", duration: "6 months", doctor: "Dr. Divyansh Singh", active: true },
    { id: "3", name: "Amoxicillin 500mg", dosage: "3 times daily", duration: "7 days", doctor: "Dr. Divyansh Singh", active: false },
  ];

  return (
    <PatientLayout title="Prescriptions" subtitle="Your active and past medication prescriptions">
      <Card className="border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Pill className="h-5 w-5 text-violet-600" />
          Medication List
        </h2>
        <div className="space-y-4">
          {prescriptions.map((med) => (
            <div key={med.id} className="rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-950">{med.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      med.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-slate-100 text-slate-500"
                    }`}>
                      {med.active ? "Active" : "Completed"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">Dosage: {med.dosage} • Duration: {med.duration}</p>
                  <p className="mt-2 text-xs text-slate-400">Prescribed by {med.doctor}</p>
                </div>
                {med.active && (
                  <Button variant="outline" size="sm" className="border-violet-200 text-violet-700 hover:bg-violet-50">
                    Refill Request
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PatientLayout>
  );
};

export const MessagesPage = () => {
  return (
    <PatientLayout title="Messages" subtitle="Secure chat with your care team">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200/80 bg-white/95 p-4 shadow-sm lg:col-span-1">
          <h2 className="mb-4 text-md font-semibold text-slate-900">Conversations</h2>
          <div className="space-y-2">
            <div className="rounded-xl bg-violet-50/70 border border-violet-100 p-3 flex gap-3 cursor-pointer">
              <div className="h-10 w-10 shrink-0 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-700">D</div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-semibold text-slate-950">Dr. Divyansh Singh</p>
                  <span className="text-[10px] text-slate-400">10:12 AM</span>
                </div>
                <p className="text-xs text-slate-600 truncate mt-0.5">Please continue the blood pressure medicine...</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200/80 bg-white/95 p-6 shadow-sm lg:col-span-2 flex flex-col h-[500px]">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-700">D</div>
            <div>
              <p className="font-semibold text-slate-950">Dr. Divyansh Singh</p>
              <p className="text-xs text-emerald-600">Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <div className="flex gap-2 max-w-[80%]">
              <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-800">
                Hi Akash, I reviewed your latest lab report. Everything looks good. Please continue the blood pressure medicine as usual.
              </div>
            </div>
            <div className="flex gap-2 max-w-[80%] ml-auto justify-end">
              <div className="rounded-2xl bg-violet-600 p-3 text-sm text-white">
                Thank you doctor. Should I schedule the follow-up for next month?
              </div>
            </div>
            <div className="flex gap-2 max-w-[80%]">
              <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-800">
                Yes, let's meet on Jul 6 for a quick check.
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </PatientLayout>
  );
};

export const ProfilePage = () => {
  return (
    <PatientLayout title="Profile" subtitle="Manage your personal and health profile details">
      <Card className="border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <User className="h-5 w-5 text-violet-600" />
          Personal Information
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
            <p className="mt-1 text-sm font-medium text-slate-950">Akash Yadav</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
            <p className="mt-1 text-sm font-medium text-slate-950">akash@gmail.com</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
            <p className="mt-1 text-sm font-medium text-slate-950">+1 (555) 019-2834</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</label>
            <p className="mt-1 text-sm font-medium text-slate-950">October 12, 1994</p>
          </div>
        </div>
      </Card>
    </PatientLayout>
  );
};

export const SettingsPage = () => {
  return (
    <PatientLayout title="Settings" subtitle="Adjust your account settings and preferences">
      <Card className="border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-violet-600" />
          Account Settings
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-950">Email Notifications</p>
              <p className="text-xs text-slate-500">Receive appointment updates and tips via email</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="font-semibold text-slate-950">SMS Reminders</p>
              <p className="text-xs text-slate-500">Get text messages before scheduled appointments</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
          </div>
        </div>
      </Card>
    </PatientLayout>
  );
};
