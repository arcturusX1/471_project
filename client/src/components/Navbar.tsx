import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null; // Don't show navbar on Login/Register pages

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={user.role === 'Faculty' ? '/faculty-dashboard' : '/student-dashboard'}>
          APCMS
        </Link>
      </div>
      <ul className="navbar-links">
        {user.role === 'Faculty' ? (
          <>
            <li><Link to="/faculty-dashboard">Home</Link></li>
            <li><Link to="/consultation-requests">Requests</Link></li>
            <li><Link to="/faculty-schedule">Schedule</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/student-dashboard">Home</Link></li>
            <li><Link to="/request-consultation">New Request</Link></li>
            <li><Link to="/my-consultations">My Schedule</Link></li>
          </>
        )}
        <li><button onClick={handleLogout} className="nav-logout">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;