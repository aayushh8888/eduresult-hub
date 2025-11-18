import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  Users, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  UserPlus, 
  BookPlus, 
  Award,
  TrendingUp,
  Clock,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SemesterDeclaration } from "@/components/SemesterDeclaration";
import { supabase } from "@/integrations/supabase/client";

// Mock data
const adminData = {
  name: "Admin User",
  email: "admin@university.edu",
};

const statsData = [
  { title: "Total Students", value: "1,234", icon: Users, trend: "+12%", color: "info" },
  { title: "Total Subjects", value: "45", icon: BookOpen, trend: "+5", color: "primary" },
  { title: "Pending Results", value: "23", icon: Clock, trend: "-8%", color: "warning" },
  { title: "Results Declared", value: "156", icon: Award, trend: "+18%", color: "success" },
];

const subjects = [
  { id: 1, code: "CS201", name: "Data Structures", year: 2, semester: 1, faculty: "Dr. Jane Smith", status: "Allocated", credits: 4 },
  { id: 2, code: "CS202", name: "Algorithms", year: 2, semester: 2, faculty: "Dr. Jane Smith", status: "Allocated", credits: 3 },
  { id: 3, code: "CS301", name: "Database Systems", year: 3, semester: 1, faculty: "Not Allocated", status: "Pending", credits: 4 },
  { id: 4, code: "CS302", name: "Operating Systems", year: 3, semester: 2, faculty: "Dr. John Doe", status: "Allocated", credits: 4 },
];

const studentsWithMarks = [
  { 
    id: 1, 
    prn: "1234567890123", 
    name: "John Doe", 
    year: 2,
    semester: 1,
    subject: "Data Structures",
    ca1: 8, 
    ca2: 9, 
    mid: 18, 
    endSem: 52,
    total: 87,
    grade: "A",
    status: "Declared"
  },
  { 
    id: 2, 
    prn: "1234567890124", 
    name: "Jane Wilson", 
    year: 2,
    semester: 1,
    subject: "Data Structures",
    ca1: 7, 
    ca2: 8, 
    mid: 16, 
    endSem: 0,
    total: 0,
    grade: "-",
    status: "Pending"
  },
  { 
    id: 3, 
    prn: "1234567890125", 
    name: "Mike Johnson", 
    year: 2,
    semester: 1,
    subject: "Algorithms",
    ca1: 9, 
    ca2: 10, 
    mid: 19, 
    endSem: 55,
    total: 93,
    grade: "A+",
    status: "Declared"
  },
];

const recentUsers = [
  { id: 1, name: "Alice Cooper", email: "alice@university.edu", role: "Student", prn: "2345678901234", createdAt: "2024-03-15" },
  { id: 2, name: "Bob Martin", email: "bob@university.edu", role: "Faculty", department: "Computer Science", createdAt: "2024-03-14" },
  { id: 3, name: "Carol Davis", email: "carol@university.edu", role: "Student", prn: "3456789012345", createdAt: "2024-03-13" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [marks, setMarks] = useState(studentsWithMarks);
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for create user
  const [newUser, setNewUser] = useState({
    role: "",
    name: "",
    email: "",
    prn: "",
    year: "",
    semester: "",
    department: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (role),
          students (roll_number, year, semester),
          faculty (department)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(profilesData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const handleEndSemChange = (studentId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    
    if (numValue > 60) {
      toast({
        title: "Invalid Marks",
        description: "End-Sem marks cannot exceed 60",
        variant: "destructive",
      });
      return;
    }

    const student = marks.find(s => s.id === studentId);
    if (student) {
      const total = student.ca1 + student.ca2 + student.mid + numValue;
      let grade = "-";
      if (total >= 90) grade = "A+";
      else if (total >= 80) grade = "A";
      else if (total >= 70) grade = "B+";
      else if (total >= 60) grade = "B";
      else if (total >= 50) grade = "C";
      else if (total >= 40) grade = "D";
      else grade = "F";

      setMarks(marks.map(s => 
        s.id === studentId ? { ...s, endSem: numValue, total, grade } : s
      ));
    }
  };

  const handleDeclareResult = (studentId: number) => {
    const student = marks.find(s => s.id === studentId);
    if (student && student.endSem === 0) {
      toast({
        title: "Cannot Declare Result",
        description: "Please enter End-Sem marks before declaring result",
        variant: "destructive",
      });
      return;
    }

    setMarks(marks.map(s => 
      s.id === studentId ? { ...s, status: "Declared" } : s
    ));

    toast({
      title: "Result Declared",
      description: "Student result has been successfully declared and is now visible to the student.",
    });
  };

  const handleAllocateSubject = () => {
    toast({
      title: "Subject Allocated",
      description: "Subject has been successfully allocated to faculty.",
    });
    setIsAllocateOpen(false);
  };

  const handleCreateUser = async () => {
    try {
      if (!newUser.role || !newUser.name || !newUser.email) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (newUser.role === "student" && !newUser.prn) {
        toast({
          title: "Validation Error",
          description: "PRN is required for students",
          variant: "destructive",
        });
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: Math.random().toString(36).slice(-8), // Temporary password
        options: {
          data: {
            full_name: newUser.name,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // Add role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ user_id: authData.user.id, role: newUser.role as any }]);

      if (roleError) throw roleError;

      // Add student-specific data
      if (newUser.role === "student") {
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            roll_number: newUser.prn,
            year: parseInt(newUser.year),
            semester: parseInt(newUser.semester),
          });

        if (studentError) throw studentError;
      }

      // Add faculty-specific data
      if (newUser.role === "faculty") {
        const { error: facultyError } = await supabase
          .from('faculty')
          .insert({
            user_id: authData.user.id,
            department: newUser.department,
          });

        if (facultyError) throw facultyError;
      }

      toast({
        title: "User Created",
        description: "User account has been created successfully.",
      });

      setNewUser({
        role: "",
        name: "",
        email: "",
        prn: "",
        year: "",
        semester: "",
        department: ""
      });
      setIsCreateUserOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast({
        title: "User Deleted",
        description: "User has been successfully removed.",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Declared") {
      return <Badge className="bg-success text-success-foreground">{status}</Badge>;
    } else if (status === "Allocated") {
      return <Badge className="bg-success text-success-foreground">{status}</Badge>;
    } else if (status === "Pending") {
      return <Badge className="bg-warning text-warning-foreground">{status}</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const filteredMarks = marks.filter(student => {
    if (selectedYear !== "all" && student.year !== parseInt(selectedYear)) return false;
    if (selectedSemester !== "all" && student.semester !== parseInt(selectedSemester)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Result Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{adminData.name}</p>
                <p className="text-xs text-muted-foreground">{adminData.email}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => (
            <Card key={stat.title} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-xs text-success font-medium">{stat.trend}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="declare" className="space-y-6">
          <TabsList className="bg-card border shadow-sm">
            <TabsTrigger value="declare" className="gap-2">
              <Award className="h-4 w-4" />
              Declare Semester
            </TabsTrigger>
            <TabsTrigger value="marks" className="gap-2">
              <FileText className="h-4 w-4" />
              Marks Management
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Subject Allocation
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>

          {/* Declare Semester Tab */}
          <TabsContent value="declare">
            <SemesterDeclaration />
          </TabsContent>

          {/* Marks Management Tab */}
          <TabsContent value="marks" className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Student Marks & Results</CardTitle>
                    <CardDescription>Review, edit, and declare student results</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="1">Year 1</SelectItem>
                        <SelectItem value="2">Year 2</SelectItem>
                        <SelectItem value="3">Year 3</SelectItem>
                        <SelectItem value="4">Year 4</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">PRN</TableHead>
                        <TableHead className="font-semibold">Student Name</TableHead>
                        <TableHead className="font-semibold">Subject</TableHead>
                        <TableHead className="text-center font-semibold">CA1 (10)</TableHead>
                        <TableHead className="text-center font-semibold">CA2 (10)</TableHead>
                        <TableHead className="text-center font-semibold">MID (20)</TableHead>
                        <TableHead className="text-center font-semibold">END (60)</TableHead>
                        <TableHead className="text-center font-semibold">Total</TableHead>
                        <TableHead className="text-center font-semibold">Grade</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-center font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMarks.map((student) => (
                        <TableRow key={student.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{student.prn}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="text-muted-foreground">{student.subject}</TableCell>
                          <TableCell className="text-center">{student.ca1}</TableCell>
                          <TableCell className="text-center">{student.ca2}</TableCell>
                          <TableCell className="text-center">{student.mid}</TableCell>
                          <TableCell className="text-center">
                            {student.status === "Declared" ? (
                              <span className="font-medium">{student.endSem}</span>
                            ) : (
                              <Input
                                type="number"
                                min="0"
                                max="60"
                                value={student.endSem || ""}
                                onChange={(e) => handleEndSemChange(student.id, e.target.value)}
                                className="w-20 text-center"
                                placeholder="0"
                              />
                            )}
                          </TableCell>
                          <TableCell className="text-center font-semibold">{student.total}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-semibold">{student.grade}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(student.status)}</TableCell>
                          <TableCell className="text-center">
                            {student.status === "Pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleDeclareResult(student.id)}
                                className="gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Declare
                              </Button>
                            )}
                            {student.status === "Declared" && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                                <CheckCircle className="h-3 w-3 text-success" />
                                Published
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subject Allocation Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Subject Allocations</CardTitle>
                    <CardDescription>Assign subjects to faculty members</CardDescription>
                  </div>
                  <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <BookPlus className="h-4 w-4" />
                        Allocate Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Allocate Subject to Faculty</DialogTitle>
                        <DialogDescription>Assign a subject to a faculty member</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                  {subject.code} - {subject.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Faculty</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select faculty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Dr. Jane Smith</SelectItem>
                              <SelectItem value="2">Dr. John Doe</SelectItem>
                              <SelectItem value="3">Dr. Sarah Wilson</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Year 1</SelectItem>
                                <SelectItem value="2">Year 2</SelectItem>
                                <SelectItem value="3">Year 3</SelectItem>
                                <SelectItem value="4">Year 4</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Semester</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Semester" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Semester 1</SelectItem>
                                <SelectItem value="2">Semester 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAllocateOpen(false)}>Cancel</Button>
                        <Button onClick={handleAllocateSubject}>Allocate</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Subject Code</TableHead>
                        <TableHead className="font-semibold">Subject Name</TableHead>
                        <TableHead className="font-semibold">Year</TableHead>
                        <TableHead className="font-semibold">Semester</TableHead>
                        <TableHead className="font-semibold">Credits</TableHead>
                        <TableHead className="font-semibold">Faculty</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((subject) => (
                        <TableRow key={subject.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono font-medium">{subject.code}</TableCell>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell>Year {subject.year}</TableCell>
                          <TableCell>Semester {subject.semester}</TableCell>
                          <TableCell>{subject.credits} credits</TableCell>
                          <TableCell className="text-muted-foreground">{subject.faculty}</TableCell>
                          <TableCell>{getStatusBadge(subject.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">User Management</CardTitle>
                    <CardDescription>Create and manage user accounts</CardDescription>
                  </div>
                  <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Create User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>Add a new student, faculty, or admin account</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>User Type</Label>
                          <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="faculty">Faculty</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input 
                            placeholder="Full name" 
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input 
                            type="email" 
                            placeholder="user@university.edu" 
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          />
                        </div>
                        {newUser.role === "student" && (
                          <>
                            <div className="space-y-2">
                              <Label>PRN</Label>
                              <Input 
                                placeholder="13-digit PRN" 
                                maxLength={13} 
                                value={newUser.prn}
                                onChange={(e) => setNewUser({...newUser, prn: e.target.value})}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Year</Label>
                                <Select value={newUser.year} onValueChange={(value) => setNewUser({...newUser, year: value})}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Year 1</SelectItem>
                                    <SelectItem value="2">Year 2</SelectItem>
                                    <SelectItem value="3">Year 3</SelectItem>
                                    <SelectItem value="4">Year 4</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Semester</Label>
                                <Select value={newUser.semester} onValueChange={(value) => setNewUser({...newUser, semester: value})}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select semester" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Semester 1</SelectItem>
                                    <SelectItem value="2">Semester 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </>
                        )}
                        {newUser.role === "faculty" && (
                          <div className="space-y-2">
                            <Label>Department</Label>
                            <Input 
                              placeholder="Department name" 
                              value={newUser.department}
                              onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateUser}>Create User</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Details</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No users found. Create your first user to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => {
                          const role = user.user_roles?.[0]?.role || 'Unknown';
                          const details = user.students?.[0] 
                            ? `PRN: ${user.students[0].roll_number}`
                            : user.faculty?.[0]
                            ? `Dept: ${user.faculty[0].department || 'N/A'}`
                            : 'Full Access';

                          return (
                            <TableRow key={user.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{user.full_name}</TableCell>
                              <TableCell className="text-muted-foreground">{user.email}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">{role}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{details}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

