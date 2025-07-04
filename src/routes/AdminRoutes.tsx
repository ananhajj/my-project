import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
 
import AdminDashboard from "@/pages/AdminDashboard";
import ContentManagement from "@/pages/ContentManagement";
import AdminLayout from "@/components/AdminLayout";
import AdminsLayout from "@/components/AdminsLayout";
 
const AdminRoutes = () => (
  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminsLayout />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<AdminDashboard />} />
    <Route path="content-management" element={<ContentManagement />} />
  </Route>
);

export default AdminRoutes;
