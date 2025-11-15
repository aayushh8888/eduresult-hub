import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LogOut, Save, BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const facultyData = {
  name: "Dr. Jane Smith",
  email: "jane.smith@university.edu",
  subjects: [
    {
      id: 1,
      name: "Data Structures",
      year: 2,
      semester: 1,
      students: [
        { id: 1, prn: "1234567890123", name: "John Doe", ca1: 8, ca2: 9, mid: 18 },
        { id: 2, prn: "1234567890124", name: "Jane Wilson", ca1: 7, ca2: 8, mid: 16 },
        { id: 3, prn: "1234567890125", name: "Bob Johnson", ca1: 9, ca2: 10, mid: 19 },
      ],
    },
    {
      id: 2,
      name: "Algorithms",
      year: 2,
      semester: 2,
      students: [
        { id: 4, prn: "1234567890126", name: "Alice Brown", ca1: 10, ca2: 9, mid: 20 },
        { id: 5, prn: "1234567890127", name: "Charlie Davis", ca1: 8, ca2: 8, mid: 17 },
      ],
    },
  ],
};

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState(facultyData.subjects[0]);
  const [marks, setMarks] = useState(selectedSubject.students);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleMarkChange = (studentId: number, field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const maxValues = { ca1: 10, ca2: 10, mid: 20 };
    
    if (numValue > maxValues[field as keyof typeof maxValues]) {
      toast({
        title: "Invalid Marks",
        description: `${field.toUpperCase()} marks cannot exceed ${maxValues[field as keyof typeof maxValues]}`,
        variant: "destructive",
      });
      return;
    }

    setMarks(marks.map(student => 
      student.id === studentId ? { ...student, [field]: numValue } : student
    ));
  };

  const handleSubmit = () => {
    toast({
      title: "Marks Submitted",
      description: "Marks have been successfully submitted to admin for review.",
    });
  };

  const handleSubjectChange = (subjectId: string) => {
    const subject = facultyData.subjects.find(s => s.id === parseInt(subjectId));
    if (subject) {
      setSelectedSubject(subject);
      setMarks(subject.students);
    }
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
              <h1 className="text-2xl font-bold text-foreground">Faculty Portal</h1>
              <p className="text-sm text-muted-foreground">{facultyData.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Faculty Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{facultyData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{facultyData.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Allocated Subjects</CardTitle>
            <CardDescription>Select a subject to enter marks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {facultyData.subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedSubject.id === subject.id ? "border-primary shadow-md" : ""
                  }`}
                  onClick={() => handleSubjectChange(subject.id.toString())}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{subject.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Year {subject.year} - Semester {subject.semester}
                      </p>
                      <Badge variant="secondary">
                        {subject.students.length} Students
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedSubject.name}</CardTitle>
                <CardDescription>
                  Year {selectedSubject.year} - Semester {selectedSubject.semester}
                </CardDescription>
              </div>
              <Button onClick={handleSubmit}>
                <Save className="mr-2 h-4 w-4" />
                Submit to Admin
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
                    <TableHead className="text-center">CA1 (10)</TableHead>
                    <TableHead className="text-center">CA2 (10)</TableHead>
                    <TableHead className="text-center">MID (20)</TableHead>
                    <TableHead className="text-center">Total (40)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono">{student.prn}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={student.ca1}
                          onChange={(e) => handleMarkChange(student.id, "ca1", e.target.value)}
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={student.ca2}
                          onChange={(e) => handleMarkChange(student.id, "ca2", e.target.value)}
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          value={student.mid}
                          onChange={(e) => handleMarkChange(student.id, "mid", e.target.value)}
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {student.ca1 + student.ca2 + student.mid}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FacultyDashboard;
