import { useState, useEffect } from "react";
import "./App.css";
import ProgressBar from "./components/ProgressBar";
import GroupFinder from "./components/GroupFinder";
import LocationFinder from "./components/LocationFinder";
import Auth from "./components/Auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [activeView, setActiveView] = useState("group-finder");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Validate that user has required fields from new auth system
        // New system uses: id, email, roles (array), profile.department
        if (parsedUser && parsedUser.id && parsedUser.email) {
          setToken(savedToken);
          setUser(parsedUser);
        } else {
          // Invalid user data (old format), clear it
          console.log("Clearing invalid user data from localStorage");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("currentUser"); // Also clear old demo user data
        }
      } catch (err) {
        // Invalid JSON, clear it
        console.log("Error parsing user data, clearing localStorage");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");
      }
    } else {
      // Also clear old demo user data if it exists
      if (localStorage.getItem("currentUser")) {
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div style={{ textAlign: "center", padding: "3rem", color: "#e2e8f0" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="app">
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="app-nav">
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            className={`nav-btn ${activeView === "project-tracker" ? "active" : ""}`}
            onClick={() => setActiveView("project-tracker")}
          >
            Project Tracker
          </button>
          <button
            className={`nav-btn ${activeView === "group-finder" ? "active" : ""}`}
            onClick={() => setActiveView("group-finder")}
          >
            Group Finder
          </button>
          <button
            className={`nav-btn ${activeView === "location-finder" ? "active" : ""}`}
            onClick={() => setActiveView("location-finder")}
          >
            Location Finder
          </button>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
            {user.name} ({user.role || user.roles?.[0]})
          </span>
          <button className="nav-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {activeView === "group-finder" ? (
        <GroupFinder user={user} token={token} />
      ) : activeView === "location-finder" ? (
        <LocationFinder />
      ) : (
        <ProjectTracker />
      )}
    </div>
  );
}

function ProjectTracker() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects`);
        if (!res.ok) {
          throw new Error("Failed to load projects");
        }
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          setError("No projects found. Add one in the database.");
          return;
        }
        setProject(data[0]);
      } catch (err) {
        setError(err.message || "Could not load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const currentStageLabel =
    project?.checkpoints?.find((c) => c.key === project?.stage)?.label ||
    "In progress";

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Track Project</h1>
          <p className="subtitle">
            {project ? project.title : "Loading project..."}
          </p>
        </div>
        {project && (
          <div className="pill">
            <span className="pill-dot" />
            <span>{currentStageLabel}</span>
          </div>
        )}
      </header>

      <main>
        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Progress</p>
              <h2>Milestones</h2>
            </div>
            {project && (
              <div className="pill secondary">
                <span className="pill-dot" />
                <span>
                  {project.checkpoints.filter((c) => c.completed).length}/
                  {project.checkpoints.length} stages done
                </span>
              </div>
            )}
          </div>

          {loading && <p className="muted">Loading project progress...</p>}
          {error && <p className="error">{error}</p>}
          {project && !error && (
            <ProgressBar checkpoints={project.checkpoints} />
          )}
        </section>

        <section className="card updates-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest update</p>
              <h2>Activity</h2>
            </div>
            {project?.latestUpdate && (
              <span className="muted">
                {formatDate(project.latestUpdate.date)}
              </span>
            )}
          </div>

          {project?.latestUpdate ? (
            <div className="latest-update">
              <div className="latest-dot" />
              <div>
                <p className="update-title">{project.latestUpdate.message}</p>
                <p className="muted">Most recent change</p>
              </div>
            </div>
          ) : (
            <p className="muted">No updates yet.</p>
          )}

          {project?.updates?.length ? (
            <div className="update-list">
              {project.updates.map((update, idx) => (
                <div key={idx} className="update-row">
                  <div className="timeline-node" />
                  <div>
                    <p className="update-message">{update.message}</p>
                    <p className="muted">{formatDate(update.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default App;
