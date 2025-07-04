import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "@/pages/Index";
import Students from "@/pages/Students";
import Attendance from "@/pages/Attendance";
import LateAttendance from "@/pages/LateAttendance";
import Reports from "@/pages/Reports";
import SchoolSettings from "@/pages/SchoolSettings";
import Profile from "@/pages/Profile";
import SchoolLayout from "@/components/SchoolLayout";

const SchoolRoutes = () => (
<Route
  path="/school"
  element={
    <ProtectedRoute requiredRole="school">
      <SchoolLayout />
    </ProtectedRoute>
  }
>
    <Route path="" element={<Index />} />
    <Route path="students" element={<Students />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="late-attendance" element={<LateAttendance />} />
    <Route path="reports" element={<Reports />} />
    <Route path="school-settings" element={<SchoolSettings />} />
    <Route path="profile" element={<Profile />} />
  </Route>
);

export default SchoolRoutes;
