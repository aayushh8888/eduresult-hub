import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, LogOut, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const studentData = {
  prn: "1234567890123",
  name: "John Doe",
  email: "john.doe@gmail.com",
  cgpa: "8.75",
};

const semesterResults = [
  {
    semester: 1,
    year: "2023-24",
    sgpa: "8.5",
    status: "Declared",
    subjects: [
      { name: "Mathematics I", ca1: 8, ca2: 9, mid: 18, endSem: 52, total: 87 },
      { name: "Physics", ca1: 7, ca2: 8, mid: 16, endSem: 48, total: 79 },
      { name: "Chemistry", ca1: 9, ca2: 9, mid: 19, endSem: 55, total: 92 },
      { name: "Programming", ca1: 10, ca2: 10, mid: 20, endSem: 58, total: 98 },
    ],
  },
  {
    semester: 2,
    year: "2023-24",
    sgpa: "9.0",
    status: "Declared",
    subjects: [
      { name: "Mathematics II", ca1: 9, ca2: 10, mid: 19, endSem: 56, total: 94 },
      { name: "Data Structures", ca1: 10, ca2: 9, mid: 20, endSem: 54, total: 93 },
      { name: "Digital Electronics", ca1: 8, ca2: 9, mid: 17, endSem: 50, total: 84 },
      { name: "Engineering Graphics", ca1: 9, ca2: 8, mid: 18, endSem: 53, total: 88 },
    ],
  },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState(semesterResults[0]);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Portal</h1>
            <p className="text-sm text-muted-foreground">PRN: {studentData.prn}</p>
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
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{studentData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{studentData.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">PRN</p>
              <p className="font-medium">{studentData.prn}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CGPA</p>
              <p className="font-bold text-2xl text-primary">{studentData.cgpa}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {semesterResults.map((sem) => (
            <Card
              key={sem.semester}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedSemester.semester === sem.semester ? "border-primary shadow-md" : ""
              }`}
              onClick={() => setSelectedSemester(sem)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Semester {sem.semester}</CardTitle>
                <CardDescription>{sem.year}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">SGPA</p>
                    <p className="text-2xl font-bold text-primary">{sem.sgpa}</p>
                  </div>
                  <Badge variant={sem.status === "Declared" ? "default" : "secondary"}>
                    {sem.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Semester {selectedSemester.semester} Results</CardTitle>
                <CardDescription>Academic Year: {selectedSemester.year}</CardDescription>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">CA1 (10)</TableHead>
                    <TableHead className="text-center">CA2 (10)</TableHead>
                    <TableHead className="text-center">MID (20)</TableHead>
                    <TableHead className="text-center">END-SEM (60)</TableHead>
                    <TableHead className="text-center">Total (100)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSemester.subjects.map((subject, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell className="text-center">{subject.ca1}</TableCell>
                      <TableCell className="text-center">{subject.ca2}</TableCell>
                      <TableCell className="text-center">{subject.mid}</TableCell>
                      <TableCell className="text-center">{subject.endSem}</TableCell>
                      <TableCell className="text-center font-bold">{subject.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 flex justify-end">
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">Semester Grade Point Average</p>
                <p className="text-3xl font-bold text-primary">{selectedSemester.sgpa}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;
