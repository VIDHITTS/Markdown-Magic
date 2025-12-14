import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Home } from "lucide-react";
import { API_URL } from "../config/api.js";
import "../styles/LikedProjects.css";

const LikedProjects = ({ user, setUser, theme, toggleTheme }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchLikedProjects();
    }
  }, [user]);

  const fetchLikedProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/feed/user/likes`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else if (response.status === 401) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (projectId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/feed/unlike/${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== projectId));
      }
    } catch (error) {
    }
  };

  const handleViewProject = (projectId) => {
    navigate(`/editor/${projectId}`);
  };

  const handleFork = async (projectId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/feed/fork/${projectId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigate(`/editor/${data.project.id}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="liked-projects-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>SnapCode</h1>
        </div>
        <div className="nav-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="browse-nav-btn"
            title="Go to Dashboard"
          >
            <Home size={18} />
            Dashboard
          </button>
          <button
            onClick={() => navigate("/browse")}
            className="browse-nav-btn"
            title="Browse Public Projects"
          >
            Browse
          </button>
          <button
            onClick={() => navigate("/liked")}
            className="browse-nav-btn"
            title="My Liked Projects"
          >
            Liked
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="profile-btn"
            title="View Profile"
          >
            <div className="user-avatar-small">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="user-name">{user?.username || "User"}</span>
          </button>
        </div>
      </nav>

      <div className="liked-content">
        <div className="liked-header">
          <div className="header-text">
            <h2>My Liked Projects</h2>
            <p>Projects you've shown love to</p>
          </div>
          <button
            className="refresh-btn"
            onClick={fetchLikedProjects}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading your liked projects...</div>
        ) : (
          <>
            {projects.length === 0 ? (
              <div className="no-projects">
                <div className="empty-state">
                  <h3>No liked projects yet</h3>
                  <p>
                    Explore the Browse page and like projects that inspire you!
                  </p>
                  <button
                    className="browse-cta-btn"
                    onClick={() => navigate("/browse")}
                  >
                    Browse Projects
                  </button>
                </div>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="project-card"
                    onClick={() => handleViewProject(project.id)}
                  >
                    <div className="project-header">
                      <div>
                        <h3>{project.title}</h3>
                        <div className="project-author">
                          by @{project.user.username}
                        </div>
                      </div>
                    </div>

                    {project.description && (
                      <p className="project-description">
                        {project.description.length > 100
                          ? `${project.description.substring(0, 100)}...`
                          : project.description}
                      </p>
                    )}

                    <div className="project-footer">
                      <div className="project-meta">
                        <div className="stat-group">
                          <span className="stat">{project.likesCount} Likes</span>
                          <span className="stat">{project.forksCount} Forks</span>
                          <span className="stat">
                            Liked {formatDate(project.likedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="action-buttons">
                        <button
                          className="action-btn unlike-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnlike(project.id);
                          }}
                          title="Unlike Project"
                        >
                          💔
                        </button>
                        <button
                          className="action-btn fork-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFork(project.id);
                          }}
                          title="Fork Project"
                        >
                          🍴
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LikedProjects;
