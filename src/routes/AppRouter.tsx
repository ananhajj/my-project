import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import SchoolRoutes from "./SchoolRoutes";
import AdminRoutes from "./AdminRoutes";
import NotFound from "@/pages/NotFound";

const AppRouter = () => (
  <Routes>
    {PublicRoutes()}
    {SchoolRoutes()}
    {AdminRoutes()}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;