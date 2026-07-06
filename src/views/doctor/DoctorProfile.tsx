import { useEffect, useState } from "react";
import DoctorLayout from "@/components/doctor/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { User, Award, Briefcase, GraduationCap, FileText, Image } from "lucide-react";

interface DoctorProfileData {
  fullName: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  bio: string;
  avatarUrl: string;
}

const DoctorProfile = () => {
  const [profile, setProfile] = useState<DoctorProfileData>({
    fullName: "",
    specialty: "",
    qualification: "",
    experienceYears: 0,
    bio: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest<DoctorProfileData>("/doctor/profile")
      .then((data) => {
        setProfile({
          fullName: data.fullName || "",
          specialty: data.specialty || "",
          qualification: data.qualification || "",
          experienceYears: Number(data.experienceYears || 0),
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || "",
        });
      })
      .catch(() => toast.error("Failed to load profile details"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "experienceYears" ? Number(value || 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/doctor/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      toast.success("Profile updated successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error("Failed to update profile details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DoctorLayout title="Profile" subtitle="View and edit your professional details">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-slate-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/30 p-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <User className="h-5 w-5 text-violet-500" /> Professional Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="py-20 text-center text-sm text-slate-400">Loading profile data...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <User className="h-4 w-4 text-slate-400" /> Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Dr. Jane Smith"
                      className="border-slate-200 bg-white rounded-xl shadow-sm focus-visible:ring-violet-500"
                    />
                  </div>

                  {/* Specialty */}
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <Award className="h-4 w-4 text-slate-400" /> Specialty *
                    </Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={profile.specialty}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Cardiologist"
                      className="border-slate-200 bg-white rounded-xl shadow-sm focus-visible:ring-violet-500"
                    />
                  </div>

                  {/* Experience Years */}
                  <div className="space-y-2">
                    <Label htmlFor="experienceYears" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <Briefcase className="h-4 w-4 text-slate-400" /> Experience (Years)
                    </Label>
                    <Input
                      id="experienceYears"
                      name="experienceYears"
                      type="number"
                      min={0}
                      max={80}
                      value={profile.experienceYears}
                      onChange={handleChange}
                      className="border-slate-200 bg-white rounded-xl shadow-sm focus-visible:ring-violet-500"
                    />
                  </div>

                  {/* Qualification */}
                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <GraduationCap className="h-4 w-4 text-slate-400" /> Qualification
                    </Label>
                    <Input
                      id="qualification"
                      name="qualification"
                      value={profile.qualification}
                      onChange={handleChange}
                      placeholder="e.g. MD, DM (Cardiology)"
                      className="border-slate-200 bg-white rounded-xl shadow-sm focus-visible:ring-violet-500"
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Image className="h-4 w-4 text-slate-400" /> Avatar Image URL
                  </Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    value={profile.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="border-slate-200 bg-white rounded-xl shadow-sm focus-visible:ring-violet-500"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <FileText className="h-4 w-4 text-slate-400" /> Biography / Experience Info
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Share details about your medical practice, research interests, and patient care philosophies..."
                    className="border-slate-200 bg-white rounded-xl shadow-sm focus-visible:ring-violet-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl px-6 py-2.5 shadow-sm transition-colors"
                  >
                    {saving ? "Saving Changes..." : "Save Profile Details"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;
