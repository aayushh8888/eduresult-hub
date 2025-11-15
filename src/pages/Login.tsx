import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignup, setIsSignup] = useState(false);
  
  const [studentPrn, setStudentPrn] = useState("");
  const [studentGoogleId, setStudentGoogleId] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  
  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("");
  const [facultyName, setFacultyName] = useState("");
  
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      // TODO: Add signup logic
      toast({
        title: "Account Created",
        description: "Your student account has been created successfully.",
      });
    }
    // TODO: Add authentication logic
    navigate("/student/dashboard");
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      // TODO: Add signup logic
      toast({
        title: "Account Created",
        description: "Your faculty account has been created successfully.",
      });
    }
    // TODO: Add authentication logic
    navigate("/faculty/dashboard");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Result Management System</CardTitle>
          <CardDescription>Login to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <div className="mb-4 flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-primary"
                >
                  {isSignup ? "Already have an account? Login" : "New user? Sign up"}
                </Button>
              </div>
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Full Name</Label>
                    <Input
                      id="student-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="student-prn">PRN (13 digits)</Label>
                  <Input
                    id="student-prn"
                    type="text"
                    placeholder="Enter your PRN"
                    value={studentPrn}
                    onChange={(e) => setStudentPrn(e.target.value)}
                    maxLength={13}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-google-id">Google ID</Label>
                  <Input
                    id="student-google-id"
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={studentGoogleId}
                    onChange={(e) => setStudentGoogleId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="Enter your password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isSignup ? "Sign Up as Student" : "Login as Student"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="faculty">
              <div className="mb-4 flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-primary"
                >
                  {isSignup ? "Already have an account? Login" : "New user? Sign up"}
                </Button>
              </div>
              <form onSubmit={handleFacultySubmit} className="space-y-4">
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="faculty-name">Full Name</Label>
                    <Input
                      id="faculty-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={facultyName}
                      onChange={(e) => setFacultyName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="faculty-email">Email</Label>
                  <Input
                    id="faculty-email"
                    type="email"
                    placeholder="faculty@university.edu"
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty-password">Password</Label>
                  <Input
                    id="faculty-password"
                    type="password"
                    placeholder="Enter your password"
                    value={facultyPassword}
                    onChange={(e) => setFacultyPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isSignup ? "Sign Up as Faculty" : "Login as Faculty"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@university.edu"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login as Admin
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
