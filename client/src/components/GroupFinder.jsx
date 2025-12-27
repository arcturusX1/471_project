import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import PostCard from "./PostCard";
import "./GroupFinder.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1202";

function GroupFinder({ user, token }) {
  const [activeTab, setActiveTab] = useState("public");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [activeTab, user]);

  const fetchPosts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let url = "";
      if (activeTab === "public") {
        url = `${API_URL}/api/group-posts/public`;
      } else if (activeTab === "my") {
        url = `${API_URL}/api/group-posts/my/${user.id}`;
      } else if (activeTab === "archived") {
        url = `${API_URL}/api/group-posts/archived/${user.id}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    setShowForm(false);
    fetchPosts();
  };

  const handleApply = async (postId) => {
    if (!user) {
      alert("Please login to apply");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupPostId: postId,
          applicantId: user.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to apply");
      }

      alert("Application submitted successfully!");
      fetchPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/applications/${applicationId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to approve");
      alert("Application approved!");
      fetchPosts();
      fetchApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/applications/${applicationId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to reject");
      alert("Application rejected");
      fetchApplications();
    } catch (err) {
      alert(err.message);
    }
  };


  return (
    <div className="group-finder">
      <header className="group-finder-header">
        <h1>Group Finder</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Create Post
        </button>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "public" ? "active" : ""}`}
          onClick={() => setActiveTab("public")}
        >
          Public Posts
        </button>
        <button
          className={`tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My Posts
        </button>
        <button
          className={`tab ${activeTab === "archived" ? "active" : ""}`}
          onClick={() => setActiveTab("archived")}
        >
          Archived
        </button>
      </div>

      {showForm && (
        <PostForm
          user={user}
          token={token}
          onClose={() => setShowForm(false)}
          onSuccess={handlePostCreated}
        />
      )}

      <div className="posts-container">
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="empty-state">No posts found</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              onApply={handleApply}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default GroupFinder;

