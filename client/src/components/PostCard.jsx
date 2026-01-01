import { useState, useEffect } from "react";
import "./GroupFinder.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function PostCard({
  post,
  currentUser,
  onApply,
  onApprove,
  onReject,
}) {
  const [showApplications, setShowApplications] = useState(false);
  const [applications, setApplications] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.id || currentUser._id;
      const postedById = post.postedBy?._id || post.postedBy?.id || post.postedBy;
      setIsOwner(postedById === userId || postedById?.toString() === userId?.toString());
    }
  }, [post, currentUser]);

  const handleShowApplications = async () => {
    if (!showApplications) {
      try {
        const res = await fetch(`${API_URL}/api/applications/post/${post._id}`);
        if (res.ok) {
          const data = await res.json();
          setApplications(data || []);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    }
    setShowApplications(!showApplications);
  };

  const isMember = post.members?.some((m) => {
    const userId = currentUser?.id || currentUser?._id;
    const memberUserId = m.user?._id || m.user?.id || m.user;
    return memberUserId?.toString() === userId?.toString();
  });

  const canApply =
    !isOwner &&
    !isMember &&
    post.status === "active" &&
    post.currentMembers < post.maxMembers;

  return (
    <div className="post-card">
      <div className="post-header">
        <div>
          <h3>{post.projectName}</h3>
          <p className="post-meta">
            {post.department} • Posted by {post.postedBy?.name || "Unknown"}
          </p>
        </div>
        <div className="member-count">
          {post.currentMembers}/{post.maxMembers}
        </div>
      </div>

      <p className="post-details">{post.details}</p>

      <div className="post-info">
        <div className="info-item">
          <strong>Supervisor:</strong> {post.supervisorName}
        </div>
        {post.techStack && post.techStack.length > 0 && (
          <div className="info-item">
            <strong>Tech Stack:</strong>
            <div className="tech-tags">
              {post.techStack.map((tech, idx) => (
                <span key={idx} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="post-actions">
        {isOwner && (
          <button
            className="btn-secondary"
            onClick={handleShowApplications}
          >
            {showApplications ? "Hide" : "View"} Applications (
            {applications.length || 0})
          </button>
        )}

        {canApply && (
          <button className="btn-primary" onClick={() => onApply(post._id)}>
            Apply to Join
          </button>
        )}

        {isMember && !isOwner && (
          <span className="member-badge">You are a member</span>
        )}

        {post.status === "filled" && (
          <span className="status-badge filled">Group Full</span>
        )}
      </div>

      {showApplications && isOwner && (
        <div className="applications-list">
          <h4>Applications</h4>
          {applications.length === 0 ? (
            <p className="muted">No applications yet</p>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="application-item">
                <div>
                  <strong>{app.applicant?.name}</strong>
                  <p className="muted">{app.applicant?.email}</p>
                  {app.message && <p>{app.message}</p>}
                </div>
                <div className="application-actions">
                  {app.status === "pending" && (
                    <>
                      <button
                        className="btn-success"
                        onClick={() => onApprove(app._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => onReject(app._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === "approved" && (
                    <span className="status-badge approved">Approved</span>
                  )}
                  {app.status === "rejected" && (
                    <span className="status-badge rejected">Rejected</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;

