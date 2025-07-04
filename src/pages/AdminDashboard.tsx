
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSchools } from "@/hooks/useSchools";
import SchoolStatsCards from "@/components/SchoolStatsCards";
import SchoolManagementTable from "@/components/SchoolManagementTable";
import AddSchoolDialog from "@/components/AddSchoolDialog";
import ExtendSubscriptionDialog from "@/components/ExtendSubscriptionDialog";
import SchoolDataView from "@/components/SchoolDataView";
import ViewLoginCredentialsDialog from "@/components/ViewLoginCredentialsDialog";
import DeleteSchoolDialog from "@/components/DeleteSchoolDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { School } from "@/hooks/useSchools";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { schools, loading, createSchool, updateSchoolStatus, extendSubscription, deleteSchool } = useSchools();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showSchoolData, setShowSchoolData] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleToggleStatus = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    if (school) {
      const newStatus = school.status === 'active' ? 'inactive' : 'active';
      updateSchoolStatus(schoolId, newStatus);
    }
  };

  const handleExtendSubscription = (school: School) => {
    setSelectedSchool(school);
    setShowExtendDialog(true);
  };

  const handleViewSchoolData = (school: School) => {
    setSelectedSchool(school);
    setShowSchoolData(true);
  };

  const handleViewCredentials = (school: School) => {
    setSelectedSchool(school);
    setShowCredentials(true);
  };

  const handleDeleteSchool = (school: School) => {
    setSelectedSchool(school);
    setShowDeleteDialog(true);
  };

  const handleConfirmExtend = (months: number) => {
    if (selectedSchool) {
      extendSubscription(selectedSchool.id, months);
    }
    setShowExtendDialog(false);
    setSelectedSchool(null);
  };

  const handleConfirmDelete = () => {
    if (selectedSchool) {
      deleteSchool(selectedSchool.id);
    }
    setShowDeleteDialog(false);
    setSelectedSchool(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-slate-600">منصة حاضرون التعليمية</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <SchoolStatsCards schools={schools} />
        </div>

        {/* Schools Management Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">إدارة المدارس</h2>
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة مدرسة جديدة
            </Button>
          </div>
          <SchoolManagementTable 
            schools={schools}
            onToggleStatus={handleToggleStatus}
            onExtendSubscription={handleExtendSubscription}
            onViewSchoolData={handleViewSchoolData}
            onViewCredentials={handleViewCredentials}
            onDeleteSchool={handleDeleteSchool}
          />
        </div>
      </div>

      <AddSchoolDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onAddSchool={createSchool}
      />

      <ExtendSubscriptionDialog
        open={showExtendDialog}
        onOpenChange={setShowExtendDialog}
        school={selectedSchool}
        onConfirm={handleConfirmExtend}
      />

      <SchoolDataView
        open={showSchoolData}
        onOpenChange={setShowSchoolData}
        school={selectedSchool}
      />

      <ViewLoginCredentialsDialog
        open={showCredentials}
        onOpenChange={setShowCredentials}
        school={selectedSchool}
      />

      <DeleteSchoolDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        school={selectedSchool}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminDashboard;
