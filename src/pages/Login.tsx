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
      toast({
        title: "Account Created",
        description: "Your student account has been created successfully.",
      });
    }
    navigate("/student/dashboard");
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      toast({
        title: "Account Created",
        description: "Your faculty account has been created successfully.",
      });
    }
    navigate("/faculty/dashboard");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center ring-4 ring-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Result Management System
          </CardTitle>
          <CardDescription className="text-base">Login to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="student" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Student
              </TabsTrigger>
              <TabsTrigger value="faculty" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Faculty
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="mt-6">
              <div className="mb-4 flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-primary hover:text-primary/80"
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
                    placeholder="1234567890123"
                    maxLength={13}
                    value={studentPrn}
                    onChange={(e) => setStudentPrn(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-google-id">Google ID</Label>
                  <Input
                    id="student-google-id"
                    type="email"
                    placeholder="student@gmail.com"
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
                    placeholder="Enter password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isSignup ? "Sign Up" : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="faculty" className="mt-6">
              <div className="mb-4 flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-primary hover:text-primary/80"
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
                    placeholder="Enter password"
                    value={facultyPassword}
                    onChange={(e) => setFacultyPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isSignup ? "Sign Up" : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
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
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
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

