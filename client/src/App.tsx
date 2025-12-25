import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { DeskReservation } from "./components/DeskReservation";
import { LabAvailability } from "./components/LabAvailability";
import { MeetingRoomReservation } from "./components/MeetingRoomReservation";
import { Reservation } from "./components/Reservation";
import { MyReservations } from "./components/MyReservations";
import { PositionApplications } from "./components/PositionApplications";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ProjectsList } from "./components/ProjectsList";
import { ProjectDetails } from "./components/ProjectDetails";
import { BookOpen, Briefcase, Building, Calendar, MonitorSmartphone, Users } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { projectApi } from "./services/projectService";
import { authApi } from "./services/positionApi";

export type UserRole = "admin" | "faculty" | "student";
export type AssessorRole = "Supervisor" | "Co-Supervisor" | "ST" | "RA" | "TA" | "External Examiner";
export type EvaluationStatus = "Pending" | "Submitted";

export interface Project {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  description: string;
  department: string;
  status: "Planning" | "In Progress" | "Review" | "Completed";
  startDate: string;
  endDate: string;
  supervisor: string;
}

export interface Criterion {
  name: string;
  maxScore: number;
  score?: number;
  comment?: string;
}

export interface Evaluation {
  id: string;
  projectId: string;
  assessorId: string;
  assessorName: string;
  assessorRole: AssessorRole;
  criteria: Criterion[];
  finalComment: string;
  totalScore: number;
  submittedAt?: Date;
  status: EvaluationStatus;
}

export type PageView = "dashboard" | "projects" | "project-details" | "reservations" | "users";

export interface Reservation {
  id: string;
  type: "desk" | "lab" | "meeting-room";
  resourceName: string;
  date: string;
  startTime: string;
  endTime: string;
  userName: string;
  userType: "faculty" | "student";
  purpose?: string;
}

export interface Position {
  id: string;
  type: "ST" | "RA" | "TA";
  title: string;
  department: string;
  course?: string;
  faculty: string;
  description: string;
  requirements: string[];
  hoursPerWeek: number;
  payRate: string;
  startDate: string;
  endDate: string;
  spots: number;
  filled: number;
}

export interface Application {
  id: string;
  positionId: string;
  studentName: string;
  email: string;
  studentId: string;
  gpa: string;
  expertise: string[];
  availability: string;
  experience: string;
  coverLetter: string;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [currentUserId] = useState("user-1");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<{ name: string; id: string; email: string; role: string } | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      type: "desk",
      resourceName: "Desk A-12",
      date: "2025-12-25",
      startTime: "09:00",
      endTime: "11:00",
      userName: "Rafsan Rahman",
      userType: "student",
      purpose: "Study session"
    },
    {
      id: "2",
      type: "lab",
      resourceName: "Computer Lab 1",
      date: "2025-12-26",
      startTime: "14:00",
      endTime: "16:00",
      userName: "Dr. Shah Alam",
      userType: "faculty",
      purpose: "Programming workshop"
    },
    {
      id: "3",
      type: "meeting-room",
      resourceName: "Conference Room",
      date: "2025-12-27",
      startTime: "10:00",
      endTime: "12:00",
      userName: "Dr. Sarah Johnson",
      userType: "faculty",
      purpose: "Team meeting"
    }
  ]);

  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      type: "TA",
      title: "Teaching Assistant - Data Structures",
      department: "Computer Science",
      course: "CS 201",
      faculty: "Md. Rifat Alam Pomil ",
      description: "Assist in teaching Data Structures course, hold office hours, grade assignments",
      requirements: ["GPA 3.5+", "Completed CS 201 with A or A+", "Good communication skills"],
      hoursPerWeek: 10,
      payRate: "$25/hour",
      startDate: "2025-12-01",
      endDate: "2026-05-15",
      spots: 2,
      filled: 0
    },
    {
      id: "2",
      type: "RA",
      title: "Research Assistant - Machine Learning Lab",
      department: "Computer Science",
      faculty: "Annajiat Alam Rasel",
      description: "Assist with ML research projects, data collection, and analysis",
      requirements: ["Python programming", "Knowledge of ML algorithms", "GPA 3.0+"],
      hoursPerWeek: 15,
      payRate: "$18/hour",
      startDate: "2025-11-20",
      endDate: "2026-08-01",
      spots: 3,
      filled: 1
    },
    {
      id: "3",
      type: "ST",
      title: "Student Tutor - Mathematics",
      department: "Mathematics",
      faculty: "Academic Support Center",
      description: "Provide one-on-one and group tutoring for calculus and algebra students",
      requirements: ["Math major or minor", "GPA 3.2+", "Patient and helpful"],
      hoursPerWeek: 8,
      payRate: "$12/hour",
      startDate: "2025-11-25",
      endDate: "2026-05-30",
      spots: 5,
      filled: 2
    }
  ]);

  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      positionId: "1",
      studentName: "Rafsan Rahman",
      email: "rafsan.rahman@university.edu",
      studentId: "22201972",
      gpa: "3.0",
      expertise: ["Data Structures", "Algorithms", "Typescript", "Python"],
      availability: "Monday-Friday, 2-6 PM",
      experience: "Tutored peers in CS courses for 1 year",
      coverLetter: "I am very interested in this TA position...",
      status: "pending",
      appliedDate: "2025-11-15"
    }
  ]);

  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: "eval-1",
      projectId: "proj-1",
      assessorId: "user-1",
      assessorName: "Dr. Shah Alam",
      assessorRole: "Supervisor",
      criteria: [
        {
          name: "Problem Understanding & Analysis",
          maxScore: 20,
          score: 18,
          comment: "Excellent understanding of indoor navigation challenges and user needs.",
        },
        {
          name: "Technical Implementation & Code Quality",
          maxScore: 20,
          score: 17,
          comment: "Clean code architecture with proper ML model integration.",
        },
        {
          name: "Innovation & Creativity",
          maxScore: 20,
          score: 19,
          comment: "Novel approach to combining computer vision with traditional mapping.",
        },
        {
          name: "Documentation & Clarity",
          maxScore: 20,
          score: 16,
          comment: "Good documentation, could include more API examples.",
        },
        {
          name: "Presentation & Communication (Viva)",
          maxScore: 20,
          score: 18,
          comment: "Clear and confident presentation with good demo.",
        },
      ],
      finalComment: "Outstanding project that addresses a real campus need. The ML model shows impressive accuracy, and the user interface is intuitive. The student demonstrated deep understanding during the viva. Recommend for departmental showcase.",
      totalScore: 88,
      submittedAt: new Date("2024-12-10"),
      status: "Submitted",
    }
  ]);

  const addReservation = (reservation: Omit<Reservation, "id">) => {
    const newReservation = {
      ...reservation,
      id: Date.now().toString()
    };
    setReservations([...reservations, newReservation]);
    toast.success("Reservation added successfully!");
  };

  const cancelReservation = (id: string) => {
    setReservations(reservations.filter(r => r.id !== id));
    toast.success("Reservation cancelled successfully!");
  };

  const addApplication = (application: Omit<Application, "id" | "appliedDate" | "status">) => {
    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      status: "pending",
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setApplications([...applications, newApplication]);
    toast.success("Application submitted successfully!");
  };

  const updateApplication = (id: string, status: "accepted" | "rejected", reason?: string) => {
    setApplications(applications.map(app =>
      app.id === id
        ? { ...app, status, updated_at: new Date().toISOString() }
        : app
    ));
    toast.success(`Application ${status} successfully!`);
  };

  const handleAssignEvaluation = (projectId: string, facultyName: string, facultyId: string) => {
    const newEvaluation: Evaluation = {
      id: `eval-${Date.now()}`,
      projectId: projectId,
      assessorId: facultyId,
      assessorName: facultyName,
      assessorRole: 'Supervisor',
      criteria: [
        { name: 'Research & Analysis', maxScore: 20, score: undefined, comment: '' },
        { name: 'Methodology & Approach', maxScore: 20, score: undefined, comment: '' },
        { name: 'Implementation & Execution', maxScore: 20, score: undefined, comment: '' },
        { name: 'Results & Discussion', maxScore: 20, score: undefined, comment: '' },
        { name: 'Presentation & Documentation', maxScore: 20, score: undefined, comment: '' },
      ],
      finalComment: '',
      totalScore: 0,
      status: 'Pending',
    };
    setEvaluations([...evaluations, newEvaluation]);
  };

  const handleAddProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    // In a real app, this would be sent to the backend
    // For now, we'll just log it
    console.log('New project added:', newProject);
    alert('Project added successfully! It will be reviewed by faculty before approval.');
  };

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    if (page !== "project-details") {
      setSelectedProjectId(null);
    }
  };

  const handleViewProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage("project-details");
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setCurrentPage("projects");
  };

  const refreshMyProjects = async () => {
    try {
      const response = await projectApi.listMyProjects();
      const mappedProjects: Project[] = response.map((p: any) => ({
        id: p._id,
        title: p.title,
        studentName: p.studentName,
        studentId: p.studentId,
        description: p.description,
        department: p.department,
        status: p.status === 'SUBMITTED' ? 'Planning' : p.status === 'IN_REVIEW' ? 'In Progress' : p.status === 'EVALUATED' ? 'Completed' : 'Planning',
        startDate: p.startDate,
        endDate: p.expectedEndDate,
        supervisor: p.supervisorName,
      }));
      setProjects(mappedProjects);
    } catch (error: any) {
      console.error('Error loading projects:', error);
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login';
      } else {
        toast.error('Failed to load projects');
      }
    }
  };

  // Load projects on mount
  useEffect(() => {
    if (userRole === 'student') {
      refreshMyProjects();
    }
  }, [userRole]);

  // Load current user info
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await authApi.getMe();
        setCurrentUser(user);
      } catch (error: any) {
        console.error('Error loading user:', error);
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    };

    loadCurrentUser();
  }, []);

  const renderReservations = () => (
    <Tabs defaultValue="reservation" className="space-y-6">
      <TabsList className="flex w-full gap-2 overflow-x-auto rounded-full bg-muted p-1">
        <TabsTrigger value="desks" className="flex items-center gap-2 px-3 py-2 text-sm font-medium shrink-0">
          <BookOpen className="size-4" />
          <span className="hidden sm:inline">Desks</span>
        </TabsTrigger>
        <TabsTrigger value="labs" className="flex items-center gap-2 px-3 py-2 text-sm font-medium shrink-0">
          <MonitorSmartphone className="size-4" />
          <span className="hidden sm:inline">Labs</span>
        </TabsTrigger>
        <TabsTrigger value="meeting-rooms" className="flex items-center gap-2 px-3 py-2 text-sm font-medium shrink-0">
          <Users className="size-4" />
          <span className="hidden sm:inline">Meeting Rooms</span>
        </TabsTrigger>
        <TabsTrigger value="reservation" className="flex items-center gap-2 px-3 py-2 text-sm font-medium shrink-0">
          <Building className="size-4" />
          <span className="hidden sm:inline">Reservation</span>
        </TabsTrigger>
        <TabsTrigger value="my-reservations" className="flex items-center gap-2 px-3 py-2 text-sm font-medium shrink-0">
          <Calendar className="size-4" />
          <span className="hidden sm:inline">My Bookings</span>
        </TabsTrigger>
        <TabsTrigger value="positions" className="flex items-center gap-2 px-3 py-2 text-sm font-medium shrink-0">
          <Briefcase className="size-4" />
          <span className="hidden sm:inline">Positions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="desks" className="space-y-6">
        <DeskReservation 
          reservations={reservations.filter(r => r.type === "desk")}
          onReserve={addReservation}
        />
      </TabsContent>

      <TabsContent value="labs" className="space-y-6">
        <LabAvailability 
          reservations={reservations.filter(r => r.type === "lab")}
          onReserve={addReservation}
        />
      </TabsContent>

      <TabsContent value="meeting-rooms" className="space-y-6">
        <MeetingRoomReservation
          reservations={reservations.filter(r => r.type === "meeting-room")}
          onReserve={addReservation}
        />
      </TabsContent>

      <TabsContent value="reservation" className="space-y-6">
        <Reservation
          reservations={reservations}
          onReserve={addReservation}
        />
      </TabsContent>

      <TabsContent value="my-reservations" className="space-y-6">
        <MyReservations 
          reservations={reservations}
          onCancel={cancelReservation}
        />
      </TabsContent>

      <TabsContent value="positions" className="space-y-6">
        <PositionApplications
          studentId={userRole === "student" ? "22201972" : undefined}
          positions={positions}
          applications={applications}
          onApply={addApplication}
          onUpdateApplication={updateApplication}
          userRole={userRole}
        />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPage={currentPage} userRole={userRole} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900">Campus Management System</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Room Reservation & Academic Project Management
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty (Dr. Shah Alam)</option>
                  <option value="student">Student (BracU)</option>
                </select>
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">
                      {userRole === "admin" ? "AD" : userRole === "faculty" ? "FA" : "ST"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      {userRole === "admin"
                        ? "Admin User"
                        : userRole === "faculty"
                        ? "Dr. Shah Alam"
                        : "Brac University Student"}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">{userRole}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {currentPage === "dashboard" && (
              <Dashboard
                userRole={userRole}
                onNavigate={handleNavigate}
                onViewProject={handleViewProject}
                projects={projects}
                evaluations={evaluations}
              />
            )}
            {currentPage === "projects" && (
              <ProjectsList
                userRole={userRole}
                onViewProject={handleViewProject}
                onAddProject={handleAddProject}
                projects={projects}
                evaluations={evaluations}
                onProjectCreated={refreshMyProjects}
                studentName={currentUser?.name || ""}
              />
            )}
            {currentPage === "project-details" && selectedProjectId && (
              <ProjectDetails
                projectId={selectedProjectId}
                userRole={userRole}
                currentUserId={currentUserId}
                onBack={handleBackToProjects}
                projects={projects}
                evaluations={evaluations}
                onSubmitEvaluation={(evaluation) => {
                  setEvaluations([...evaluations, evaluation]);
                }}
                onAssignEvaluation={handleAssignEvaluation}
              />
            )}
            {currentPage === "reservations" && renderReservations()}
            {currentPage === "users" && <div>User Management</div>}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
