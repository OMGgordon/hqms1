'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Clock, CalendarDays, User, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";

export default function PatientDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Queue Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Queue Position</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Position 5</div>
              <p className="text-xs text-muted-foreground">
                Estimated wait: 20 minutes
              </p>
              <div className="mt-3">
                <Progress value={60} className="w-full" />
              </div>
              <Badge variant="secondary" className="mt-2">Cardiology Queue</Badge>
            </CardContent>
          </Card>

          {/* Next Appointment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today 10:30 AM</div>
              <p className="text-xs text-muted-foreground">
                Dr. Sarah Smith - Cardiology
              </p>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                Room 204, 2nd Floor
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                Reschedule
              </Button>
            </CardContent>
          </Card>

          {/* Health Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Overview</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">All Good</div>
              <p className="text-xs text-muted-foreground">
                Last checkup: 2 weeks ago
              </p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Blood Pressure</span>
                  <span className="text-green-600">Normal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Heart Rate</span>
                  <span className="text-green-600">72 bpm</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="default">
                <User className="mr-2 h-4 w-4" />
                Join Walk-in Queue
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CalendarDays className="mr-2 h-4 w-4" />
                Book New Appointment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                View All Appointments
              </Button>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Dr. Sarah Smith - Cardiology</p>
                  <p className="text-sm text-muted-foreground">September 15, 2025 at 2:30 PM</p>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Dr. Michael Lee - Orthopedics</p>
                  <p className="text-sm text-muted-foreground">September 10, 2025 at 11:00 AM</p>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
