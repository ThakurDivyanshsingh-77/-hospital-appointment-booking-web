import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Building2, CircleCheck, CircleOff } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Department {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const AdminDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");

  const fetchDepartments = async () => {
    const response = await apiRequest<{ departments: Department[] }>("/admin/departments");
    setDepartments(response.departments || []);
  };

  useEffect(() => {
    fetchDepartments().catch(() => toast.error("Failed to load departments"));
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditing(null);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editing) {
        await apiRequest(`/admin/departments/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify({ name, description }),
        });
        toast.success("Department updated");
      } else {
        await apiRequest("/admin/departments", {
          method: "POST",
          body: JSON.stringify({ name, description }),
        });
        toast.success("Department added");
      }
      setDialogOpen(false);
      resetForm();
      fetchDepartments().catch(() => toast.error("Failed to refresh departments"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save department"));
    }
  };

  const toggleActive = async (department: Department) => {
    try {
      await apiRequest(`/admin/departments/${department.id}/active`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !department.isActive }),
      });
      toast.success(department.isActive ? "Department deactivated" : "Department activated");
      fetchDepartments().catch(() => toast.error("Failed to refresh departments"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update status"));
    }
  };

  const deleteDepartment = async (department: Department) => {
    if (!confirm(`Delete ${department.name}?`)) {
      return;
    }
    try {
      await apiRequest(`/admin/departments/${department.id}`, { method: "DELETE" });
      toast.success("Department deleted");
      fetchDepartments().catch(() => toast.error("Failed to refresh departments"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete department"));
    }
  };

  const filteredDepartments = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return departments;
    }

    return departments.filter((department) => {
      return (
        department.name.toLowerCase().includes(search) ||
        (department.description || "").toLowerCase().includes(search)
      );
    });
  }, [departments, query]);

  const activeCount = departments.filter((department) => department.isActive).length;
  const inactiveCount = departments.length - activeCount;

  return (
    <AdminLayout title="Departments" subtitle="Manage hospital service units and keep offerings up to date">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Total</p>
              <Building2 className="h-4 w-4 text-violet-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">{departments.length}</p>
            <p className="mt-1 text-xs text-slate-500">Department records</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Active</p>
              <CircleCheck className="h-4 w-4 text-violet-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-violet-700">{activeCount}</p>
            <p className="mt-1 text-xs text-slate-500">Visible in operations</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Inactive</p>
              <CircleOff className="h-4 w-4 text-rose-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-rose-700">{inactiveCount}</p>
            <p className="mt-1 text-xs text-slate-500">Temporarily hidden</p>
          </Card>
        </div>

        <Card className="border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search departments..."
                className="h-10 border-slate-200 pl-9"
              />
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
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit Department" : "Add Department"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={name} onChange={(event) => setName(event.target.value)} required className="mt-1" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="mt-1"
                      rows={4}
                      placeholder="Add a short overview of this department"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-xl bg-violet-600 text-white hover:bg-violet-700">
                    {editing ? "Update Department" : "Add Department"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {filteredDepartments.length === 0 ? (
          <Card className="border-slate-200/80 bg-white/90 p-10 text-center text-sm text-slate-500 shadow-sm">
            No departments match your search.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDepartments.map((department) => (
              <Card key={department.id} className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{department.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {department.description || "No description provided."}
                    </p>
                  </div>
                  <Badge
                    className={
                      department.isActive ? "rounded-md bg-violet-100 text-violet-700" : "rounded-md bg-rose-100 text-rose-700"
                    }
                  >
                    {department.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-xs text-slate-500">Visibility</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={department.isActive} onCheckedChange={() => toggleActive(department)} />
                    <span className="text-xs font-medium text-slate-600">
                      {department.isActive ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(department);
                      setName(department.name);
                      setDescription(department.description || "");
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700"
                    onClick={() => deleteDepartment(department)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDepartments;
