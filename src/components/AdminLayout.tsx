
import { ReactNode } from "react";
import AdminHeader from "./AdminHeader";
import Footer from "./Footer";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden" dir="rtl">
      {/* Animated background decorative elements */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-school-green to-school-teal rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-64 h-64 bg-gradient-to-br from-school-blue to-school-navy rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-gradient-to-br from-school-teal to-school-green rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-16 w-48 h-48 bg-gradient-to-br from-school-navy to-school-blue rounded-full blur-xl animate-pulse delay-[1500ms]"></div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-school-green rotate-45 rounded-lg animate-bounce"></div>
        <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-school-blue rotate-12 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-school-teal -rotate-12 rounded-lg animate-bounce delay-700"></div>
      </div>
      
      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
           style={{
             backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--school-navy)) 1px, transparent 0)`,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-gradient-to-br from-transparent via-school-green/10 to-transparent"></div>
      
      {/* Layout structure without sidebar */}
      <div className="relative min-h-screen w-full z-10">
        <AdminHeader />
        <main className="flex-1 backdrop-blur-[0.5px] p-4">
          <div className="max-w-full">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
