import { useEffect, useState } from "react";
import "./App.css";
import ProgressBar from "./components/ProgressBar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function App() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
