import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import RequestConsultation from './pages/RequestConsultation';
import ConsultationRequests from './pages/ConsultationRequests';
import FacultySchedule from './pages/FacultySchedule';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar now found */}
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Routes */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />

          {/* Consultation Routes */}
          <Route path="/request-consultation" element={<RequestConsultation />} />
          <Route path="/consultation-requests" element={<ConsultationRequests />} />
          <Route path="/faculty-schedule" element={<FacultySchedule />} />

          {/* Use Navigate for default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;