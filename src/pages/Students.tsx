import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useStudents } from "@/hooks/useStudents";
import { useRealSchoolSettings } from "@/hooks/useRealSchoolSettings";
import { Users, Plus, Trash2, Upload, Download, UserPlus, AlertTriangle, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface StudentForm {
  name: string;
  grade: string;
  section: string;
  studentId: string;
}

const Students = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [groupByStage, setGroupByStage] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  
  const { students, addStudent, removeStudent, addMultipleStudents } = useStudents();
  const { settings, loading } = useRealSchoolSettings();
  const { toast } = useToast();
  const form = useForm<StudentForm>();

  // Helper functions for working with real school settings
  const getAvailableGrades = () => {
    if (!settings) return [];
    const grades: string[] = [];
    settings.stages.forEach(stage => {
      if (stage.enabled) {
        stage.grades.forEach((grade: any) => {
          grades.push(grade.name);
        });
      }
    });
    return grades;
  };

  const getAvailableSections = (gradeName: string) => {
    if (!settings) return [];
    for (const stage of settings.stages) {
      if (stage.enabled) {
        const grade = stage.grades.find((g: any) => g.name === gradeName);
        if (grade) {
          return grade.sections || ['أ'];
        }
      }
    }
    return ['أ'];
  };

  const availableGrades = getAvailableGrades();
  const selectedGradeForForm = form.watch("grade");
  const availableSections = selectedGradeForForm ? getAvailableSections(selectedGradeForForm) : [];

  // Helper functions for stage filtering
  const enabledStages = settings ? settings.stages.filter((stage: any) => stage.enabled) : [];
  const hasMultipleStages = enabledStages.length > 1;
  const isConfigured = settings && settings.school_name && settings.school_name.trim().length > 0;

  const getGradesByStage = (stageName: string) => {
    if (!settings) return [];
    const stage = settings.stages.find((s: any) => s.name === stageName && s.enabled);
    return stage ? stage.grades.map((g: any) => g.name) : [];
  };

  const getStageByGrade = (gradeName: string) => {
    if (!settings) return null;
    for (const stage of settings.stages) {
      if (stage.enabled && stage.grades.some((g: any) => g.name === gradeName)) {
        return stage.name;
      }
    }
    return null;
  };

  // Get available grades based on selected stage
  const getFilteredGrades = () => {
    if (selectedStage) {
      return getGradesByStage(selectedStage);
    }
    return availableGrades;
  };

  const filteredGrades = getFilteredGrades();

  // فلترة الطلاب
  const filteredStudents = students.filter(student => {
    const stageMatch = !selectedStage || getStageByGrade(student.grade) === selectedStage;
    const gradeMatch = !selectedGrade || student.grade === selectedGrade;
    const sectionMatch = !selectedSection || student.section === selectedSection;
    return stageMatch && gradeMatch && sectionMatch;
  });

  // Group students by stage
  const groupedStudents = () => {
    if (!groupByStage || !hasMultipleStages) return { ungrouped: filteredStudents };
    
    const grouped: { [key: string]: any[] } = {};
    
    filteredStudents.forEach(student => {
      const stageName = getStageByGrade(student.grade) || 'غير محدد';
      if (!grouped[stageName]) {
        grouped[stageName] = [];
      }
      grouped[stageName].push(student);
    });
    
    return grouped;
  };

  const toggleStageExpansion = (stageName: string) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageName)) {
      newExpanded.delete(stageName);
    } else {
      newExpanded.add(stageName);
    }
    setExpandedStages(newExpanded);
  };

  const onSubmit = (data: StudentForm) => {
    // التحقق من عدم تكرار رقم الطالب
    const existingStudent = students.find(s => s.studentId === data.studentId);
    if (existingStudent) {
      toast({
        title: "خطأ",
        description: "رقم الطالب موجود مسبقاً",
        variant: "destructive"
      });
      return;
    }

    addStudent(data);
    form.reset();
    setIsDialogOpen(false);
    
    toast({
      title: "تم إضافة الطالب بنجاح",
      description: `تم إضافة ${data.name} إلى ${data.grade} شعبة ${data.section}`,
    });
  };

  const handleBulkAdd = () => {
    if (!selectedGrade || !selectedSection) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الصف والشعبة أولاً",
        variant: "destructive"
      });
      return;
    }

    const lines = bulkText.trim().split('\n');
    const newStudents = lines
      .filter(line => line.trim())
      .map((line, index) => {
        const parts = line.trim().split('\t');
        const name = parts[0] || line.trim();
        const studentId = parts[1] || `STU${Date.now()}${index}`;
        
        return {
          name,
          grade: selectedGrade,
          section: selectedSection,
          studentId
        };
      })
      .filter(student => 
        student.name && 
        !students.find(s => s.studentId === student.studentId)
      );

    if (newStudents.length > 0) {
      addMultipleStudents(newStudents);
      setBulkText("");
      setSelectedStage("");
      setSelectedGrade("");
      setSelectedSection("");
      
      toast({
        title: "تم إضافة الطلاب بنجاح",
        description: `تم إضافة ${newStudents.length} طالب`,
      });
    }
  };

  const handleRemoveStudent = (id: string, name: string) => {
    removeStudent(id);
    toast({
      title: "تم حذف الطالب",
      description: `تم حذف ${name} من قائمة الطلاب`,
    });
  };

  // Reset filters when stage changes
  const handleStageChange = (stage: string) => {
    setSelectedStage(stage);
    setSelectedGrade("");
    setSelectedSection("");
  };

  // Reset section when grade changes
  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedSection("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">جاري تحميل البيانات...</div>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-center">
              يجب إعداد المدرسة أولاً قبل إضافة الطلاب. 
              <Link to="/school/school-settings" className="font-bold underline mr-2">
                اذهب إلى إعدادات المدرسة
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const studentGroups = groupedStudents();
  const cardStyle = "bg-white/80 backdrop-blur-sm border border-neutral-gray";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الطلاب</h1>
            <p className="text-gray-600">إضافة وإدارة بيانات الطلاب</p>
          </div>
          <div className="flex gap-2">
            <Link to="/school/school-settings">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                إعدادات المدرسة
              </Button>
            </Link>
            <Link to="/school/">
              <Button variant="outline">العودة للرئيسية</Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">إجمالي الطلاب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">عدد الصفوف</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {availableGrades.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">المراحل المفعلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {enabledStages.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">نوع الحضور</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-orange-600">
                {settings?.attendance_type === 'daily' ? 'يومي' : 'بالحصص'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Add Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              إضافة طلاب متعددين
            </CardTitle>
            <CardDescription>
              أدخل أسماء الطلاب (كل اسم في سطر منفصل) أو انسخ من ملف Excel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hasMultipleStages && (
                <div>
                  <Label htmlFor="bulkStage">المرحلة</Label>
                  <Select value={selectedStage} onValueChange={setSelectedStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {enabledStages.map(stage => (
                        <SelectItem key={stage.id} value={stage.name}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="bulkGrade">الصف</Label>
                <Select 
                  value={selectedGrade} 
                  onValueChange={setSelectedGrade}
                  disabled={hasMultipleStages && !selectedStage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={hasMultipleStages && !selectedStage ? "اختر المرحلة أولاً" : "اختر الصف"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredGrades.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bulkSection">الشعبة</Label>
                <Select 
                  value={selectedSection} 
                  onValueChange={setSelectedSection}
                  disabled={!selectedGrade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedGrade ? "اختر الصف أولاً" : "اختر الشعبة"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedGrade && getAvailableSections(selectedGrade).map(section => (
                      <SelectItem key={section} value={section}>شعبة {section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="bulkText">أسماء الطلاب</Label>
              <textarea
                id="bulkText"
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
                placeholder="أدخل أسماء الطلاب هنا...&#10;كل اسم في سطر منفصل&#10;أحمد محمد&#10;فاطمة علي&#10;خالد عبدالله"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />
            </div>
            <Button onClick={handleBulkAdd} disabled={!bulkText.trim() || !selectedGrade || !selectedSection}>
              إضافة جميع الطلاب
            </Button>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">فلترة الطلاب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {hasMultipleStages && (
                <div>
                  <Label>فلترة حسب المرحلة</Label>
                  <Select value={selectedStage} onValueChange={handleStageChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المراحل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع المراحل</SelectItem>
                      {enabledStages.map(stage => (
                        <SelectItem key={stage.id} value={stage.name}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label>فلترة حسب الصف</Label>
                <Select 
                  value={selectedGrade} 
                  onValueChange={handleGradeChange}
                  disabled={hasMultipleStages && !selectedStage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الصفوف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الصفوف</SelectItem>
                    {filteredGrades.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>فلترة حسب الشعبة</Label>
                <Select 
                  value={selectedSection} 
                  onValueChange={setSelectedSection}
                  disabled={!selectedGrade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الشعب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الشعب</SelectItem>
                    {selectedGrade && getAvailableSections(selectedGrade).map(section => (
                      <SelectItem key={section} value={section}>شعبة {section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {hasMultipleStages && (
                <div>
                  <Label>التصنيف حسب المرحلة</Label>
                  <Select value={groupByStage ? "grouped" : "all"} onValueChange={(value) => setGroupByStage(value === "grouped")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">عرض الكل</SelectItem>
                      <SelectItem value="grouped">تصنيف حسب المرحلة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedStage("");
                    setSelectedGrade("");
                    setSelectedSection("");
                    setGroupByStage(false);
                  }}
                >
                  إلغاء الفلترة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  قائمة الطلاب ({filteredStudents.length})
                </CardTitle>
                <CardDescription>
                  إدارة بيانات الطلاب المسجلين
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة طالب جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>إضافة طالب جديد</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات الطالب الجديد
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم الطالب</FormLabel>
                            <FormControl>
                              <Input placeholder="أحمد محمد علي" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الصف</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر الصف" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableGrades.map(grade => (
                                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="section"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الشعبة</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر الشعبة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableSections.map(section => (
                                  <SelectItem key={section} value={section}>شعبة {section}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الطالب</FormLabel>
                            <FormControl>
                              <Input placeholder="STU001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        إضافة الطالب
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد طلاب مطابقون للفلترة المحددة
              </div>
            ) : groupByStage && hasMultipleStages ? (
              // Grouped view by stage
              <div className="space-y-6">
                {Object.entries(studentGroups).map(([stageName, stageStudents]) => (
                  <div key={stageName} className="border rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleStageExpansion(stageName)}
                    >
                      <div className="flex items-center gap-2">
                        {expandedStages.has(stageName) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <h3 className="font-semibold text-lg">{stageName}</h3>
                        <Badge variant="secondary" className="mr-2">
                          {stageStudents.length} طالب
                        </Badge>
                      </div>
                    </div>
                    
                    {expandedStages.has(stageName) && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>م</TableHead>
                            <TableHead>اسم الطالب</TableHead>
                            <TableHead>الصف</TableHead>
                            <TableHead>الشعبة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stageStudents.map((student, index) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <Badge variant="outline">{index + 1}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.grade}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">شعبة {student.section}</Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveStudent(student.id, student.name)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Regular table view
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>م</TableHead>
                    <TableHead>اسم الطالب</TableHead>
                    {hasMultipleStages && <TableHead>المرحلة</TableHead>}
                    <TableHead>الصف</TableHead>
                    <TableHead>الشعبة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Badge variant="outline">{index + 1}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      {hasMultipleStages && (
                        <TableCell>
                          <Badge variant="secondary">
                            {getStageByGrade(student.grade)}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">شعبة {student.section}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(student.id, student.name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Students;
