import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PatientLayout from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

const ALL_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

interface Department {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  departmentId: string | null;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const BookAppointment = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [departmentId, setDepartmentId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiRequest<{ departments: Department[]; doctors: Doctor[] }>("/patient/book-meta");
      setDepartments(response.departments || []);
      setAllDoctors(response.doctors || []);
    };

    fetchData().catch(() => toast.error("Failed to load booking options"));
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!departmentId || departmentId === "all") {
      return allDoctors;
    }
    return allDoctors.filter((doctor) => doctor.departmentId === departmentId);
  }, [departmentId, allDoctors]);

  useEffect(() => {
    setDoctorId("");
  }, [departmentId]);

  useEffect(() => {
    setTimeSlot("");
  }, [doctorId, date]);

  useEffect(() => {
    if (success) return;

    if (!doctorId || !date) {
      setBookedSlots([]);
      return;
    }

    const fetchBooked = async () => {
      const dateText = format(date, "yyyy-MM-dd");
      const response = await apiRequest<{ bookedSlots: string[] }>(
        `/patient/booked-slots?doctorId=${doctorId}&date=${dateText}`
      );
      const nextSlots = response.bookedSlots || [];
      setBookedSlots(nextSlots);
      if (timeSlot && nextSlots.includes(timeSlot)) {
        setTimeSlot("");
        toast.warning("The selected time slot was just booked by another patient.");
      }
    };

    fetchBooked().catch(() => setBookedSlots([]));

    const interval = setInterval(() => {
      fetchBooked().catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [doctorId, date, timeSlot, success]);

  const availableSlots = useMemo(() => {
    return ALL_SLOTS.map((slot) => ({
      slot,
      available: !bookedSlots.includes(slot),
    }));
  }, [bookedSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !date || !timeSlot) {
      return;
    }

    setSubmitting(true);
    try {
      const appointmentDate = format(date, "yyyy-MM-dd");
      await apiRequest("/patient/appointments", {
        method: "POST",
        body: JSON.stringify({
          doctorId,
          departmentId: departmentId && departmentId !== "all" ? departmentId : null,
          appointmentDate,
          timeSlot,
          notes: notes.trim(),
        }),
      });
      setSuccess(true);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to book appointment"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <PatientLayout title="Book Appointment">
        <Card className="mx-auto max-w-lg border-slate-200/80 bg-white/95 p-12 text-center shadow-sm">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-violet-600" />
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Appointment Booked!</h2>
          <p className="text-slate-500">
            Your appointment request has been submitted. The doctor will confirm it shortly.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => {
                setSuccess(false);
                setDate(undefined);
                setTimeSlot("");
                setNotes("");
              }}
            >
              Book Another
            </Button>
            <Button variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50" onClick={() => navigate("/patient/appointments")}>
              View Appointments
            </Button>
          </div>
        </Card>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Book Appointment" subtitle="Select a department, doctor, date and time">
      <Card className="mx-auto max-w-2xl border-slate-200/80 bg-white/95 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Department</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger className="mt-1.5 border-slate-200">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Doctor *</Label>
            <Select value={doctorId} onValueChange={setDoctorId} required>
              <SelectTrigger className="mt-1.5 border-slate-200">
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {filteredDoctors.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No doctors available</div>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.fullName} - {doctor.specialty}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Preferred Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("mt-1.5 w-full justify-start border-slate-200 text-left font-normal", !date && "text-slate-500")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(selectedDate) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate < today || selectedDate.getDay() === 0;
                  }}
                  initialFocus
                  className="pointer-events-auto p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          {doctorId && date && (
            <div>
              <Label className="mb-2 block">Time Slot *</Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {availableSlots.map(({ slot, available }) => (
                  <button
                    key={slot}
                    type="button"
                    disabled={!available}
                    onClick={() => setTimeSlot(slot)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                      !available &&
                        "cursor-not-allowed border-red-200 bg-red-50 text-red-600 opacity-70",
                      available && timeSlot !== slot && "border-emerald-200 bg-emerald-50/20 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50",
                      available && timeSlot === slot && "border-violet-600 bg-violet-600 text-white"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full border border-emerald-200 bg-emerald-50/20" /> Free
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full border border-red-200 bg-red-50" /> Booked
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-600" /> Selected
                </span>
              </div>
            </div>
          )}

          <div>
            <Label>Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your symptoms or reason for visit..."
              className="mt-1.5"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={submitting || !doctorId || !date || !timeSlot}
          >
            {submitting ? "Booking..." : "Confirm Appointment"}
          </Button>
        </form>
      </Card>
    </PatientLayout>
  );
};

export default BookAppointment;
