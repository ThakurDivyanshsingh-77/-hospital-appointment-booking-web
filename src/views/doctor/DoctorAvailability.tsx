import { useEffect, useState } from "react";
import { format } from "date-fns";
import DoctorLayout from "@/components/doctor/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";

const ALL_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];

const DoctorAvailability = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([]);
      return;
    }

    const fetchBookedSlots = async () => {
      const dateText = format(selectedDate, "yyyy-MM-dd");
      const response = await apiRequest<{ bookedSlots: string[] }>(`/doctor/availability?date=${dateText}`);
      setBookedSlots(response.bookedSlots || []);
    };

    fetchBookedSlots().catch(() => setBookedSlots([]));

    const interval = setInterval(() => {
      fetchBookedSlots().catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  const isSunday = (date: Date) => date.getDay() === 0;
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <DoctorLayout title="Availability" subtitle="View your schedule and booked slots">
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card className="border-slate-200/80 bg-white/95 shadow-sm">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => isSunday(date) || date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">{selectedDate ? formattedDate : "Select a date"}</CardTitle>
            <p className="text-xs text-slate-500">
              {bookedSlots.length} of {ALL_SLOTS.length} slots booked
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {ALL_SLOTS.map((slot) => {
                const booked = bookedSlots.includes(slot);
                return (
                  <div
                    key={slot}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                      booked
                        ? "border-red-200 bg-red-50/40 opacity-60 cursor-not-allowed select-none"
                        : "border-emerald-200 bg-emerald-50/40 text-emerald-800"
                    }`}
                  >
                    <span className="font-medium text-slate-900">{slot}</span>
                    <Badge
                      className={`text-[10px] ${
                        booked ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {booked ? "Booked" : "Free"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorAvailability;
