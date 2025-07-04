
import { useStudents } from "@/hooks/useStudents";
import { useAttendance } from "@/hooks/useAttendance";
import { useRealSchoolSettings } from "@/hooks/useRealSchoolSettings";
import { useLateAttendance } from "@/hooks/useLateAttendance";
import { ClassesAttendanceCard } from "@/components/ClassesAttendanceCard";
import { WeeklyAttendanceChart } from "@/components/WeeklyAttendanceChart";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/LoginForm";
import { LoadingState } from "@/components/LoadingState";
import { NoStudentsState } from "@/components/NoStudentsState";
import { DashboardStats } from "@/components/DashboardStats";
import { QuickNavigation } from "@/components/QuickNavigation";

const Index = () => {
  const { students } = useStudents();
  const { getTodayAttendance, attendanceRecords } = useAttendance(students);
  const { getTodayLateCount } = useLateAttendance();
  const { settings, loading } = useRealSchoolSettings();
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, loading: authLoading } = useAuth();

  // Force refresh when attendance records change
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [attendanceRecords.length]);

  const todayAttendance = getTodayAttendance();

  const totalStudents = students.length;
  const presentStudents = todayAttendance.present;
  const absentStudents = todayAttendance.absent;
  
  // حساب عدد الطلاب المتأخرين من سجلات التأخر المنفصلة
  const lateStudents = getTodayLateCount();

  // Get the first letter of school name for logo
  const schoolLogo = settings?.school_name && settings.school_name.trim() ? settings.school_name.trim().charAt(0) : 'م';

  console.log('Current user in Index:', user);
  console.log('Auth loading:', authLoading);
  console.log('Settings loading:', loading);
  console.log('School settings:', settings);
  console.log('Today late students count:', lateStudents);

  // Show loading state while auth is loading
  if (authLoading) {
    return <LoadingState />;
  }

  // Check if user is authenticated - if not, show login form
  if (!user) {
    console.log('No user found, showing login form');
    return <LoginForm />;
  }

  // If user is authenticated, show dashboard even if school settings are not configured yet
  // If no students, show the no students state
  if (students.length === 0) {
    return <NoStudentsState schoolLogo={schoolLogo} />;
  }

  // Main dashboard view when everything is set up
  return (
<div key={refreshKey} className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#E6F6F0]/40 to-[#FDECEC]/30 p-4 lg:p-6" dir="rtl">
<div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Quick Stats Cards */}
        <DashboardStats 
          totalStudents={totalStudents}
          presentStudents={presentStudents}
          absentStudents={absentStudents}
          lateStudents={lateStudents}
        />
  
        {/* Classes Attendance Status Card */}
        <ClassesAttendanceCard />
  
        {/* Weekly Attendance Chart */}
        <WeeklyAttendanceChart />
  
        {/* Quick Navigation Cards */}
        <QuickNavigation />
      </div>
    </div>
  );
}

export default Index;
