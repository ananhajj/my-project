
import ProfileHeader from "@/components/profile/ProfileHeader";
import EmailSection from "@/components/profile/EmailSection";
import PasswordSection from "@/components/profile/PasswordSection";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 p-6" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-school-navy via-school-blue to-school-teal bg-clip-text text-transparent mb-2">
            حسابي
          </h1>
          <p className="text-school-navy/70">إدارة بيانات الحساب الشخصي</p>
        </div>

        {/* Profile Avatar */}
        <ProfileHeader />

        {/* Email Section */}
        <EmailSection />

        {/* Password Section */}
        <PasswordSection />
      </div>
    </div>
  );
};

export default Profile;
