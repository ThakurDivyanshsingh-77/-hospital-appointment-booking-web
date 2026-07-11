import { useEffect, useState, useMemo } from "react";
import DoctorLayout from "@/components/doctor/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, Mail, Phone, Search, Users } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  appointmentCount: number;
  lastAppointmentDate: string;
  joinedDate: string;
}

const DoctorPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ patients: Patient[] }>("/doctor/patients")
      .then((data) => {
        setPatients(data.patients || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [patients, search]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DoctorLayout title="Patients" subtitle="Manage and view details of your assigned patients">
      <div className="space-y-6">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search patients by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-slate-200 bg-white rounded-xl shadow-sm focus-visible:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm shrink-0 w-fit">
            <Users className="h-4 w-4 text-slate-400" />
            <span>Total Patients: {filteredPatients.length}</span>
          </div>
        </div>

        {/* Patients Grid/Table */}
        <Card className="border-slate-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/30 p-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" /> Patient Registry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-20 text-center text-sm text-slate-400">Loading patients...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="py-20 text-center text-sm text-slate-400">
                {search ? "No patients match your search query." : "You have no assigned patients yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/10">
                      <th className="px-6 py-4">Patient Info</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Appointments</th>
                      <th className="px-6 py-4">Last Visit</th>
                      <th className="px-6 py-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPatients.map((patient) => {
                      const initial = patient.fullName.charAt(0);
                      return (
                        <tr key={patient.id} className="hover:bg-slate-50/30 transition-colors text-sm text-slate-600">
                          <td className="px-6 py-4 font-medium">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-extrabold text-sm shadow-sm">
                                {initial}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{patient.fullName}</p>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ID: #CC{patient.id.slice(-4)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Mail className="h-3.5 w-3.5 text-slate-400" /> {patient.email}
                              </p>
                              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Phone className="h-3.5 w-3.5 text-slate-400" /> {patient.phone}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                              {patient.appointmentCount} {patient.appointmentCount === 1 ? "booking" : "bookings"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="h-4 w-4 text-slate-400" /> {formatDate(patient.lastAppointmentDate)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {formatDate(patient.joinedDate)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorPatients;
