import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LogOut, Save, CheckCircle, Edit, UserPlus, BookPlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const adminData = {
  name: "Admin User",
  email: "admin@university.edu",
};

const subjects = [
  { id: 1, name: "Data Structures", year: 2, semester: 1, faculty: "Dr. Jane Smith", status: "Allocated" },
  { id: 2, name: "Algorithms", year: 2, semester: 2, faculty: "Dr. Jane Smith", status: "Allocated" },
  { id: 3, name: "Database Systems", year: 3, semester: 1, faculty: "Not Allocated", status: "Pending" },
];

const studentsWithMarks = [
  { 
    id: 1, 
    prn: "1234567890123", 
    name: "John Doe", 
    subject: "Data Structures",
    ca1: 8, 
    ca2: 9, 
    mid: 18, 
    endSem: 52,
    status: "Declared"
  },
  { 
    id: 2, 
    prn: "1234567890124", 
    name: "Jane Wilson", 
    subject: "Data Structures",
    ca1: 7, 
    ca2: 8, 
    mid: 16, 
    endSem: 0,
    status: "Pending"
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [marks, setMarks] = useState(studentsWithMarks);
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);

  const handleLogout = () => {
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

    setMarks(marks.map(student => 
      student.id === studentId ? { ...student, endSem: numValue } : student
    ));
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

    setMarks(marks.map(student => 
      student.id === studentId ? { ...student, status: "Declared" } : student
    ));

    toast({
      title: "Result Declared",
      description: "Student result has been successfully declared and is now visible to the student.",
    });
  };

  const handleSaveMarks = () => {
    toast({
      title: "Marks Saved",
      description: "All marks have been saved successfully.",
    });
  };

  const handleAllocateSubject = () => {
    toast({
      title: "Subject Allocated",
      description: "Subject has been successfully allocated to faculty.",
    });
    setIsAllocateOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/login")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
              <p className="text-sm text-muted-foreground">{adminData.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="marks" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="marks">Manage Marks</TabsTrigger>
            <TabsTrigger value="subjects">Subject Allocation</TabsTrigger>
          </TabsList>

          <TabsContent value="marks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Student Marks Management</CardTitle>
                    <CardDescription>View and edit marks, enter End-Sem scores, and declare results</CardDescription>
                  </div>
                  <Button onClick={handleSaveMarks}>
                    <Save className="mr-2 h-4 w-4" />
                    Save All Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PRN</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">CA1</TableHead>
                        <TableHead className="text-center">CA2</TableHead>
                        <TableHead className="text-center">MID</TableHead>
                        <TableHead className="text-center">END-SEM</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marks.map((student) => {
                        const total = student.ca1 + student.ca2 + student.mid + student.endSem;
                        return (
                          <TableRow key={student.id}>
                            <TableCell className="font-mono">{student.prn}</TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.subject}</TableCell>
                            <TableCell className="text-center">{student.ca1}</TableCell>
                            <TableCell className="text-center">{student.ca2}</TableCell>
                            <TableCell className="text-center">{student.mid}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="60"
                                value={student.endSem || ""}
                                onChange={(e) => handleEndSemChange(student.id, e.target.value)}
                                className="w-20 text-center"
                                disabled={student.status === "Declared"}
                              />
                            </TableCell>
                            <TableCell className="text-center font-bold">{total}</TableCell>
                            <TableCell>
                              <Badge variant={student.status === "Declared" ? "default" : "secondary"}>
                                {student.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleDeclareResult(student.id)}
                                disabled={student.status === "Declared"}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Declare
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Subject Allocation</CardTitle>
                    <CardDescription>Allocate subjects to faculty members</CardDescription>
                  </div>
                  <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <BookPlus className="mr-2 h-4 w-4" />
                        Allocate Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Allocate Subject to Faculty</DialogTitle>
                        <DialogDescription>
                          Select a subject and assign it to a faculty member
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Database Systems</SelectItem>
                              <SelectItem value="2">Operating Systems</SelectItem>
                              <SelectItem value="3">Computer Networks</SelectItem>
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
                              <SelectItem value="2">Dr. John Brown</SelectItem>
                              <SelectItem value="3">Prof. Alice Johnson</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Semester</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sem" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button onClick={handleAllocateSubject} className="w-full">
                          Allocate Subject
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject Name</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Allocated Faculty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell>{subject.year}</TableCell>
                          <TableCell>{subject.semester}</TableCell>
                          <TableCell>{subject.faculty}</TableCell>
                          <TableCell>
                            <Badge variant={subject.status === "Allocated" ? "default" : "secondary"}>
                              {subject.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
