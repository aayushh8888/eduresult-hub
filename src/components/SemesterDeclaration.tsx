import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Award, Download, CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data for semester declaration
const mockSemesterData = [
  // Subject 1: Data Structures
  { id: 1, prn: "1234567890123", name: "John Doe", subject: "Data Structures", subjectCode: "CS201", year: 2, semester: 1, credits: 4, ca1: 8, ca2: 9, mid: 18, endSem: 52 },
  { id: 2, prn: "1234567890124", name: "Jane Wilson", subject: "Data Structures", subjectCode: "CS201", year: 2, semester: 1, credits: 4, ca1: 7, ca2: 8, mid: 16, endSem: 0 },
  { id: 3, prn: "1234567890125", name: "Mike Johnson", subject: "Data Structures", subjectCode: "CS201", year: 2, semester: 1, credits: 4, ca1: 9, ca2: 10, mid: 19, endSem: 55 },
  
  // Subject 2: Algorithms
  { id: 4, prn: "1234567890123", name: "John Doe", subject: "Algorithms", subjectCode: "CS202", year: 2, semester: 1, credits: 3, ca1: 9, ca2: 8, mid: 17, endSem: 50 },
  { id: 5, prn: "1234567890124", name: "Jane Wilson", subject: "Algorithms", subjectCode: "CS202", year: 2, semester: 1, credits: 3, ca1: 8, ca2: 9, mid: 18, endSem: 0 },
  { id: 6, prn: "1234567890125", name: "Mike Johnson", subject: "Algorithms", subjectCode: "CS202", year: 2, semester: 1, credits: 3, ca1: 10, ca2: 9, mid: 19, endSem: 58 },

  // Subject 3: Web Development
  { id: 7, prn: "1234567890123", name: "John Doe", subject: "Web Development", subjectCode: "CS203", year: 2, semester: 1, credits: 4, ca1: 10, ca2: 9, mid: 18, endSem: 54 },
  { id: 8, prn: "1234567890124", name: "Jane Wilson", subject: "Web Development", subjectCode: "CS203", year: 2, semester: 1, credits: 4, ca1: 9, ca2: 10, mid: 19, endSem: 53 },
  { id: 9, prn: "1234567890125", name: "Mike Johnson", subject: "Web Development", subjectCode: "CS203", year: 2, semester: 1, credits: 4, ca1: 8, ca2: 8, mid: 17, endSem: 51 },
];

const gradeScale = [
  { min: 90, max: 100, grade: "A+", gradePoint: 10 },
  { min: 80, max: 89, grade: "A", gradePoint: 9 },
  { min: 70, max: 79, grade: "B+", gradePoint: 8 },
  { min: 60, max: 69, grade: "B", gradePoint: 7 },
  { min: 50, max: 59, grade: "C", gradePoint: 6 },
  { min: 40, max: 49, grade: "D", gradePoint: 5 },
  { min: 0, max: 39, grade: "F", gradePoint: 0 },
];

const calculateGrade = (total: number) => {
  const gradeInfo = gradeScale.find(g => total >= g.min && total <= g.max);
  return gradeInfo || { grade: "F", gradePoint: 0 };
};

export const SemesterDeclaration = () => {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState("2");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [marksData, setMarksData] = useState(mockSemesterData);
  const [isDeclared, setIsDeclared] = useState(false);

  // Filter data by selected year and semester
  const filteredData = useMemo(() => {
    return marksData.filter(
      (item) => item.year === parseInt(selectedYear) && item.semester === parseInt(selectedSemester)
    );
  }, [marksData, selectedYear, selectedSemester]);

  // Get unique subjects for the selected semester
  const subjects = useMemo(() => {
    const uniqueSubjects = [...new Set(filteredData.map(item => item.subjectCode))];
    const subjectList = uniqueSubjects.map(code => {
      const subjectData = filteredData.find(item => item.subjectCode === code);
      return {
        code,
        name: subjectData?.subject || "",
        credits: subjectData?.credits || 0
      };
    });
    
    // Set first subject as default if not selected
    if (subjectList.length > 0 && !selectedSubject) {
      setSelectedSubject(subjectList[0].code);
    }
    
    return subjectList;
  }, [filteredData, selectedSubject]);

  // Filter data by selected subject
  const subjectFilteredData = useMemo(() => {
    if (!selectedSubject) return filteredData;
    return filteredData.filter(item => item.subjectCode === selectedSubject);
  }, [filteredData, selectedSubject]);

  // Get unique students for the selected subject
  const students = useMemo(() => {
    const uniqueStudents = [...new Set(subjectFilteredData.map(item => item.prn))];
    return uniqueStudents.map(prn => {
      const studentData = subjectFilteredData.find(item => item.prn === prn);
      return {
        prn,
        name: studentData?.name || ""
      };
    });
  }, [subjectFilteredData]);

  // Check if all marks are complete
  const isAllMarksComplete = useMemo(() => {
    return filteredData.every(item => 
      item.ca1 > 0 && item.ca2 > 0 && item.mid > 0 && item.endSem > 0
    );
  }, [filteredData]);

  // Count missing marks
  const missingMarksCount = useMemo(() => {
    return filteredData.filter(item => item.endSem === 0).length;
  }, [filteredData]);

  const handleEndSemChange = (id: number, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0 || numValue > 60) {
      toast({
        title: "Invalid Input",
        description: "END-sem marks must be between 0 and 60",
        variant: "destructive",
      });
      return;
    }

    setMarksData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, endSem: numValue } : item
      )
    );
  };

  const handleDeclareSemester = () => {
    if (!isAllMarksComplete) {
      toast({
        title: "Cannot Declare",
        description: "All marks must be entered before declaring the semester",
        variant: "destructive",
      });
      return;
    }

    // Calculate totals, grades, and SGPA for each student
    const studentResults = students.map(student => {
      const studentMarks = filteredData.filter(item => item.prn === student.prn);
      
      let totalCredits = 0;
      let totalGradePoints = 0;

      const subjectResults = studentMarks.map(mark => {
        const total = mark.ca1 + mark.ca2 + mark.mid + mark.endSem;
        const { grade, gradePoint } = calculateGrade(total);
        totalCredits += mark.credits;
        totalGradePoints += gradePoint * mark.credits;

        return {
          ...mark,
          total,
          grade,
          gradePoint
        };
      });

      const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";

      return {
        student,
        subjectResults,
        sgpa,
        totalCredits
      };
    });

    setIsDeclared(true);
    
    toast({
      title: "Semester Declared Successfully",
      description: `Results for Year ${selectedYear}, Semester ${selectedSemester} have been declared for ${students.length} students across ${subjects.length} subjects.`,
    });

    console.log("Declaration Results:", studentResults);
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Downloading Results",
      description: "Semester result PDF is being generated...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Selection Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Declare Semester Results
          </CardTitle>
          <CardDescription>
            Select year and semester to declare results for all students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear} disabled={isDeclared}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4">Fourth Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={isDeclared}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={isDeclared}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.code} value={subject.code}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Alert */}
          {!isDeclared && (
            <Alert variant={isAllMarksComplete ? "default" : "destructive"} className="border-2">
              {isAllMarksComplete ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All marks are complete! You can now declare the semester.
                  </AlertDescription>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {missingMarksCount} END-sem marks are missing. Complete all marks to enable declaration.
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}

          {isDeclared && (
            <Alert className="border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Semester declared successfully! Results are now visible to students.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{students.length}</div>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-info">{subjects.length}</div>
            <p className="text-sm text-muted-foreground">Total Subjects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{missingMarksCount}</div>
            <p className="text-sm text-muted-foreground">Missing END Marks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              {filteredData.length - missingMarksCount}
            </div>
            <p className="text-sm text-muted-foreground">Complete Marks</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subjects in this Semester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {subjects.map(subject => (
              <div key={subject.code} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{subject.code}</div>
                  <div className="text-sm text-muted-foreground">{subject.name}</div>
                </div>
                <Badge variant="outline">{subject.credits} Credits</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Marks - {selectedSubject}</CardTitle>
          <CardDescription>
            Enter missing END-sem marks for students in this subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">PRN</TableHead>
                  <TableHead className="font-semibold">Student Name</TableHead>
                  <TableHead className="text-center font-semibold">CA1 (10)</TableHead>
                  <TableHead className="text-center font-semibold">CA2 (10)</TableHead>
                  <TableHead className="text-center font-semibold">MID (20)</TableHead>
                  <TableHead className="text-center font-semibold">END (60)</TableHead>
                  <TableHead className="text-center font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectFilteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.prn}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.ca1}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.ca2}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.mid}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {isDeclared ? (
                        <Badge variant="outline">{item.endSem}</Badge>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          max="60"
                          value={item.endSem || ""}
                          onChange={(e) => handleEndSemChange(item.id, e.target.value)}
                          className="w-20 text-center"
                          placeholder="0"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.endSem > 0 ? (
                        <Badge variant="default" className="bg-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {isDeclared ? (
          <Button onClick={handleDownloadPDF} size="lg" className="bg-primary">
            <Download className="h-4 w-4 mr-2" />
            Download Semester Results (PDF)
          </Button>
        ) : (
          <Button
            onClick={handleDeclareSemester}
            disabled={!isAllMarksComplete}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Award className="h-4 w-4 mr-2" />
            Declare Entire Semester
          </Button>
        )}
      </div>
    </div>
  );
};
