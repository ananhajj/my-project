// src/pages/LandingPage.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-6">
      {/* الشعار */}
      <img src="/lovable-uploads/ceeee985-6f40-459e-8179-d315fbab21ab.png" alt="شعار حاضرون" className="w-24 h-24 mb-4" />

      {/* العنوان */}
      <h1 className="text-4xl font-extrabold text-blue-900 text-center">
        أهلًا بك في منصة <span className="text-school-green">حاضرون</span>
      </h1>

      {/* الوصف */}
      <p className="text-gray-600 text-center max-w-md mt-4 text-lg">
        منصة ذكية لرصد الحضور والتأخر للطلاب في المدارس. يرجى اختيار نوع الدخول أدناه.
      </p>

      {/* أزرار الدخول */}
      <div className="flex gap-6 mt-8">
        <Link to="/auth">
          <Button className="bg-school-green hover:bg-school-green/90 text-white px-8 py-4 text-lg rounded-xl shadow-md">
            دخول المدرسة
          </Button>
        </Link>
        
      </div>
    </div>
  );
};

export default LandingPage;
