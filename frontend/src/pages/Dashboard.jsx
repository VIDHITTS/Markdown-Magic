import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Plus,
  Code,
  Trash2,
  Eye,
  Calendar,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { API_URL } from "../config/api.js";
import "../styles/Dashboard.css";

const Dashboard = ({ user, setUser, theme, toggleTheme }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    isPublic: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (retryCount = 0) => {
    try {
      const response = await fetch(`${API_URL}/api/code/all`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setLoading(false);
      } else if (response.status === 401) {
        if (retryCount === 0) {
          setTimeout(() => fetchProjects(1), 500);
          return;
        }
        setUser(null);
        navigate("/");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/code/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (response.ok) {
        setShowCreateModal(false);
        setNewProject({ title: "", description: "", isPublic: false });
        navigate(`/editor/${data.project.id}`);
      } else {
        alert(data.message || "Failed to create project");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/code/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (error) {}
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard-container">
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

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="header-text">
            <h2>My Projects</h2>
            <p>Create and manage your code projects</p>
          </div>
          <button
            className="create-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} />
            New Project
          </button>
        </div>

        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <Code size={64} className="empty-icon" />
            <h3>{searchQuery ? "No projects found" : "No projects yet"}</h3>
            <p>
              {searchQuery
                ? "Try a different search term"
                : "Create your first project to get started"}
            </p>
            {!searchQuery && (
              <button
                className="create-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={20} />
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/editor/${project.id}`)}
              >
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <div
                    className="project-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="action-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}

                <div className="project-footer">
                  <div className="project-meta">
                    <Calendar size={14} />
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>
                  {project.isPublic && (
                    <span className="public-badge">
                      <Eye size={14} />
                      Public
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="title">Project Title *</label>
                <input
                  type="text"
                  id="title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  placeholder="My Awesome Project"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  placeholder="What's this project about?"
                  rows="3"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newProject.isPublic}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        isPublic: e.target.checked,
                      })
                    }
                  />
                  <span>Make this project public</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
