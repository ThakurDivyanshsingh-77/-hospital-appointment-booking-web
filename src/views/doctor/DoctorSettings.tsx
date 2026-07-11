import { useState } from "react";
import DoctorLayout from "@/components/doctor/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { Shield, Bell, Settings, Lock, Eye, EyeOff } from "lucide-react";

const DoctorSettings = () => {
  const [activeTab, setActiveTab] = useState<"security" | "notifications" | "system">("security");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Mock Notification settings state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
    dailyDigest: true,
  });

  // Mock System settings state
  const [system, setSystem] = useState({
    theme: "light",
    language: "en",
    startOfWeek: "monday",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Notification preferences updated");
  };

  const handleSystemChange = (key: keyof typeof system, value: string) => {
    setSystem((prev) => ({ ...prev, [key]: value }));
    toast.success("System preferences updated");
  };

  return (
    <DoctorLayout title="Settings" subtitle="Manage your account preferences, system controls, and security">
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-[200px_1fr]">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-1.5 md:border-r border-slate-200/80 pr-4">
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "security"
                ? "bg-blue-100 text-blue-800 shadow-[inset_0_0_0_1px_rgba(109,40,217,0.15)]"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <Shield className="h-4.5 w-4.5" /> Security
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "notifications"
                ? "bg-blue-100 text-blue-800 shadow-[inset_0_0_0_1px_rgba(109,40,217,0.15)]"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <Bell className="h-4.5 w-4.5" /> Notifications
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "system"
                ? "bg-blue-100 text-blue-800 shadow-[inset_0_0_0_1px_rgba(109,40,217,0.15)]"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <Settings className="h-4.5 w-4.5" /> System
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1">
          {activeTab === "security" && (
            <Card className="border-slate-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/30 p-5">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-500" /> Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="border-slate-200 bg-white rounded-xl shadow-sm pr-10 focus-visible:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="border-slate-200 bg-white rounded-xl shadow-sm pr-10 focus-visible:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      value={passwords.confirmNewPassword}
                      onChange={handlePasswordChange}
                      required
                      className="border-slate-200 bg-white rounded-xl shadow-sm focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={savingPassword}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-5 py-2.5 shadow-sm transition-colors"
                    >
                      {savingPassword ? "Updating Password..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="border-slate-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/30 p-5">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" /> Notifications & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="divide-y divide-slate-100 space-y-4">
                  {/* Email Alerts */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Email Notifications</p>
                      <p className="text-xs text-slate-400 mt-0.5">Receive email alerts for appointment updates.</p>
                    </div>
                    <button
                      onClick={() => toggleNotification("emailAlerts")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications.emailAlerts ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          notifications.emailAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* SMS Alerts */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">SMS Alerts</p>
                      <p className="text-xs text-slate-400 mt-0.5">Send a text message alert for emergency patient check-ins.</p>
                    </div>
                    <button
                      onClick={() => toggleNotification("smsAlerts")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications.smsAlerts ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          notifications.smsAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Browser Push Alerts */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Browser Push Notifications</p>
                      <p className="text-xs text-slate-400 mt-0.5">Get desktop alerts for instant patient requests.</p>
                    </div>
                    <button
                      onClick={() => toggleNotification("pushAlerts")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications.pushAlerts ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          notifications.pushAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Daily digest */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Daily Digest Summary</p>
                      <p className="text-xs text-slate-400 mt-0.5">Receive a daily summary of your scheduled timeslots every morning.</p>
                    </div>
                    <button
                      onClick={() => toggleNotification("dailyDigest")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications.dailyDigest ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          notifications.dailyDigest ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "system" && (
            <Card className="border-slate-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/30 p-5">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" /> System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-w-sm">
                  {/* Theme Select */}
                  <div className="space-y-2">
                    <Label htmlFor="theme">Interface Theme</Label>
                    <select
                      id="theme"
                      value={system.theme}
                      onChange={(e) => handleSystemChange("theme", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="light">Light Theme</option>
                      <option value="dark">Dark Theme (Coming Soon)</option>
                    </select>
                  </div>

                  {/* Language Select */}
                  <div className="space-y-2">
                    <Label htmlFor="language">UI Language</Label>
                    <select
                      id="language"
                      value={system.language}
                      onChange={(e) => handleSystemChange("language", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  {/* Calendar Weekday Start */}
                  <div className="space-y-2">
                    <Label htmlFor="startOfWeek">Calendar Starts On</Label>
                    <select
                      id="startOfWeek"
                      value={system.startOfWeek}
                      onChange={(e) => handleSystemChange("startOfWeek", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="monday">Monday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorSettings;
