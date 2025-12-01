import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Heart,
  GitFork,
  Eye,
  Calendar,
  Search,
  Sun,
  Moon,
  Home,
  User,
} from "lucide-react";
import LikesModal from "../components/LikesModal.jsx";
import "../styles/Browse.css";

const Browse = ({ user, theme, toggleTheme }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [sortBy, page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/feed/browse?page=${page}&limit=12&sortBy=${sortBy}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProjects(data.projects);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (projectId, isLiked) => {
    try {
      const endpoint = isLiked ? "unlike" : "like";
      const response = await fetch(
        `http://localhost:3000/api/feed/${endpoint}/${projectId}`,
        {
          method: isLiked ? "DELETE" : "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Update the project in the list
        setProjects(
          projects.map((project) => {
            if (project.id === projectId) {
              return {
                ...project,
                isLiked: !isLiked,
                likesCount: isLiked
                  ? project.likesCount - 1
                  : project.likesCount + 1,
              };
            }
            return project;
          })
        );
      } else if (response.status === 401) {
        // User not authenticated, redirect to login
        navigate("/login");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleFork = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/feed/fork/${projectId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Navigate to the forked project editor
        navigate(`/editor/${data.project.id}`);
      } else if (response.status === 401) {
        // User not authenticated, redirect to login
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error forking project:", error);
    }
  };

  const handleViewProject = (projectId) => {
    navigate(`/editor/${projectId}`);
  };

  const handleShowLikes = (projectId) => {
    setSelectedProjectId(projectId);
    setShowLikesModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="browse-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>
            <span className="brand-mark">Snap</span>
            <span className="brand-magic">Code</span>
          </h1>
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
            ❤️ Liked
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

      <div className="browse-content">
        <div className="browse-header">
          <div className="header-text">
            <h2>Browse Public Projects</h2>
            <p>Discover and fork amazing projects from the community</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading projects...</p>
          </div>
        ) : (
          <>
            <div className="projects-grid">
              {projects.length === 0 ? (
                <div className="empty-state">
                  <Eye size={64} className="empty-icon" />
                  <h3>No public projects found</h3>
                  <p>Be the first to share your project with the community!</p>
                </div>
              ) : (
                projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="project-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                          <button
                            className={`stat-btn clickable-stat ${
                              project.isLiked ? "liked" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(project.id, project.isLiked);
                            }}
                            title={project.isLiked ? "Unlike" : "Like"}
                          >
                            <Heart
                              size={14}
                              fill={project.isLiked ? "currentColor" : "none"}
                            />
                            <span>{project.likesCount}</span>
                          </button>
                          <span className="stat">
                            <GitFork size={14} />
                            <span>{project.forksCount}</span>
                          </span>
                          <span className="stat">
                            <Calendar size={14} />
                            <span>{formatDate(project.createdAt)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="action-buttons">
                        <button
                          className="action-btn fork-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFork(project.id);
                          }}
                          title="Fork Project"
                        >
                          <GitFork size={16} />
                        </button>
                        <button
                          className="action-btn view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProject(project.id);
                          }}
                          title="View Project"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <LikesModal
        projectId={selectedProjectId}
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
      />
    </div>
  );
};

export default Browse;
