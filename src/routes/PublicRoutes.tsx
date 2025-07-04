import { Route, Navigate } from "react-router-dom";
import Auth from "@/pages/Auth";
import AdminLogin from "@/pages/AdminLogin";
import LandingPage from "@/pages/LandingPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Help from "@/pages/Help";
  

const PublicRoutes = () => (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/help" element={<Help />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/login" element={<Navigate to="/auth" replace />} />
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/school-login" element={<Navigate to="/auth" replace />} />
  </>
);

export default PublicRoutes;
