import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, UserCheck, UserX, Building2 } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  isActive: boolean;
  departmentId: string | null;
  department: { name: string } | null;
  email: string;
}

interface Department {
  id: string;
  name: string;
  isActive: boolean;
}

const NO_DEPARTMENT = "__none__";
const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [departmentId, setDepartmentId] = useState(NO_DEPARTMENT);
  const [submitting, setSubmitting] = useState(false);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchDoctors = async () => {
    const response = await apiRequest<{ doctors: Doctor[] }>("/admin/doctors");
    setDoctors(response.doctors || []);
  };

  const fetchDepartments = async () => {
    const response = await apiRequest<{ departments: Department[] }>("/admin/departments");
    setDepartments((response.departments || []).filter((item) => item.isActive));
  };

  useEffect(() => {
    fetchDoctors().catch(() => toast.error("Failed to load doctors"));
    fetchDepartments().catch(() => toast.error("Failed to load departments"));
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setSpecialty("");
    setQualification("");
    setExperienceYears(0);
    setDepartmentId(NO_DEPARTMENT);
    setEditing(null);
  };

  const openEdit = (doctor: Doctor) => {
    setEditing(doctor);
    setFullName(doctor.fullName);
    setSpecialty(doctor.specialty);
    setQualification(doctor.qualification || "");
    setExperienceYears(doctor.experienceYears || 0);
    setDepartmentId(doctor.departmentId || NO_DEPARTMENT);
    setDialogOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        fullName,
        specialty,
        qualification,
        experienceYears,
        departmentId: departmentId === NO_DEPARTMENT ? null : departmentId,
      };

      if (editing) {
        await apiRequest(`/admin/doctors/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Doctor updated");
      } else {
        await apiRequest("/admin/doctors", {
          method: "POST",
          body: JSON.stringify({
            ...payload,
            email,
            password,
          }),
        });
        toast.success("Doctor added successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchDoctors().catch(() => toast.error("Failed to refresh doctors"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save doctor"));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (doctor: Doctor) => {
    try {
      await apiRequest(`/admin/doctors/${doctor.id}/active`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !doctor.isActive }),
      });
      toast.success(doctor.isActive ? "Doctor deactivated" : "Doctor activated");
      fetchDoctors().catch(() => toast.error("Failed to refresh doctors"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update status"));
    }
  };

  const deleteDoctor = async (doctor: Doctor) => {
    if (!confirm(`Delete ${doctor.fullName}?`)) {
      return;
    }

    try {
      await apiRequest(`/admin/doctors/${doctor.id}`, {
        method: "DELETE",
      });
      toast.success("Doctor deleted");
      fetchDoctors().catch(() => toast.error("Failed to refresh doctors"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete doctor"));
    }
  };

  const filteredDoctors = useMemo(() => {
    const search = query.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        search.length === 0 ||
        doctor.fullName.toLowerCase().includes(search) ||
        doctor.specialty.toLowerCase().includes(search) ||
        (doctor.qualification || "").toLowerCase().includes(search) ||
        (doctor.department?.name || "").toLowerCase().includes(search) ||
        doctor.email.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && doctor.isActive) ||
        (statusFilter === "inactive" && !doctor.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [doctors, query, statusFilter]);

  const activeCount = doctors.filter((doctor) => doctor.isActive).length;
  const inactiveCount = doctors.length - activeCount;
  const noDepartmentCount = doctors.filter((doctor) => !doctor.department).length;

  return (
    <AdminLayout title="Doctors" subtitle="Add, update, and monitor your clinical team from one place">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{doctors.length}</p>
            <p className="mt-1 text-xs text-slate-500">Registered doctors</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Active</p>
              <UserCheck className="h-4 w-4 text-violet-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">{activeCount}</p>
            <p className="mt-1 text-xs text-slate-500">Available for bookings</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Inactive</p>
              <UserX className="h-4 w-4 text-rose-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">{inactiveCount}</p>
            <p className="mt-1 text-xs text-slate-500">Temporarily disabled</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Unassigned</p>
              <Building2 className="h-4 w-4 text-purple-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">{noDepartmentCount}</p>
            <p className="mt-1 text-xs text-slate-500">No department linked</p>
          </Card>
        </div>

        <Card className="border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, specialty, email..."
                  className="h-10 border-slate-200 pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active only</SelectItem>
                  <SelectItem value="inactive">Inactive only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) {
                  resetForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="h-10 gap-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700">
                  <Plus className="h-4 w-4" />
                  Add Doctor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4">
                  {!editing && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          type="email"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          type="password"
                          required
                          minLength={6}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Specialty</Label>
                      <Input
                        value={specialty}
                        onChange={(event) => setSpecialty(event.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Qualification</Label>
                      <Input
                        value={qualification}
                        onChange={(event) => setQualification(event.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Experience (Years)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={experienceYears}
                        onChange={(event) => setExperienceYears(Number(event.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Department</Label>
                      <Select value={departmentId} onValueChange={setDepartmentId}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NO_DEPARTMENT}>No department</SelectItem>
                          {departments.map((department) => (
                            <SelectItem key={department.id} value={department.id}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-violet-600 text-white hover:bg-violet-700"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : editing ? "Update Doctor" : "Add Doctor"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        <Card className="overflow-hidden border-slate-200/80 bg-white/90 shadow-sm">
          <div className="border-b border-slate-200 px-5 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Doctor Directory</p>
              <Badge variant="secondary" className="rounded-md bg-slate-100 text-slate-600">
                {filteredDoctors.length} shown
              </Badge>
            </div>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No doctors match your current filters.</div>
          ) : (
            <>
              <div className="space-y-3 p-4 md:hidden">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{doctor.fullName}</p>
                        <p className="text-xs text-slate-500">{doctor.email}</p>
                      </div>
                      <Badge
                        className={doctor.isActive ? "bg-violet-100 text-violet-700" : "bg-rose-100 text-rose-700"}
                      >
                        {doctor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <p className="text-slate-500">
                        Specialty: <span className="font-medium text-slate-700">{doctor.specialty}</span>
                      </p>
                      <p className="text-slate-500">
                        Experience: <span className="font-medium text-slate-700">{doctor.experienceYears} yrs</span>
                      </p>
                      <p className="col-span-2 text-slate-500">
                        Department:{" "}
                        <span className="font-medium text-slate-700">{doctor.department?.name || "Not assigned"}</span>
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch checked={doctor.isActive} onCheckedChange={() => toggleActive(doctor)} />
                        <span className="text-xs text-slate-500">Toggle status</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(doctor)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteDoctor(doctor)} className="text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="p-4">Name</th>
                      <th className="p-4">Specialty</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Experience</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-slate-50/70">
                        <td className="p-4">
                          <p className="font-medium text-slate-900">{doctor.fullName}</p>
                          <p className="text-xs text-slate-500">{doctor.email}</p>
                        </td>
                        <td className="p-4 text-slate-600">{doctor.specialty}</td>
                        <td className="p-4 text-slate-600">{doctor.department?.name || "Not assigned"}</td>
                        <td className="p-4 text-slate-600">{doctor.experienceYears} yrs</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Switch checked={doctor.isActive} onCheckedChange={() => toggleActive(doctor)} />
                            <span className="text-xs text-slate-500">{doctor.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(doctor)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteDoctor(doctor)}
                              className="text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDoctors;
