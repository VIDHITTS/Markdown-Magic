import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Save,
  Download,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Edit3,
  Check,
  X,
  ChevronLeft,
} from "lucide-react";
import "../styles/EditorSidebar.css";

const EditorSidebar = ({
  theme,
  toggleTheme,
  showonlypreview,
  setshowpreview,
  downloadZip,
  onSave,
  saving,
  projectTitle,
  projectDescription,
  onUpdateMetadata,
  user,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(projectTitle);
  const [editedDescription, setEditedDescription] =
    useState(projectDescription);
  const navigate = useNavigate();

  const handleSaveMetadata = () => {
    if (editedTitle.trim()) {
      onUpdateMetadata(editedTitle, editedDescription);
      setIsEditingTitle(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(projectTitle);
    setEditedDescription(projectDescription);
    setIsEditingTitle(false);
  };

  return (
    <div
      className={`editor-sidebar ${isCollapsed ? "collapsed" : ""}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="sidebar-header">
        <div className="sidebar-title">
          <h2>Markdown</h2>
          <h2>Magic</h2>
        </div>
        <button
          className="toggle-btn"
          onClick={() => navigate("/dashboard")}
          title="Back to Dashboard"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {!isCollapsed && (
        <div className="project-info">
          {isEditingTitle ? (
            <div className="edit-metadata">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Project title"
                className="title-input"
                autoFocus
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Description (optional)"
                className="description-input"
                rows="2"
              />
              <div className="edit-actions">
                <button
                  className="save-edit-btn"
                  onClick={handleSaveMetadata}
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  className="cancel-edit-btn"
                  onClick={handleCancelEdit}
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="project-display">
              <div className="project-title-row">
                <h3>{projectTitle}</h3>
                <button
                  className="edit-btn"
                  onClick={() => setIsEditingTitle(true)}
                  title="Edit project info"
                >
                  <Edit3 size={14} />
                </button>
              </div>
              {projectDescription && (
                <p className="project-desc">{projectDescription}</p>
              )}
            </div>
          )}
        </div>
      )}

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-title">Navigation</h3>
          <ul className="nav-items">
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => navigate("/dashboard")}
              >
                <span className="nav-icon">
                  <Home size={18} />
                </span>
                <span className="nav-text">Dashboard</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-title">Actions</h3>
          <ul className="nav-items">
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => onSave()}
                disabled={saving}
              >
                <span className="nav-icon">
                  <Save size={18} />
                </span>
                <span className="nav-text">
                  {saving ? "Saving..." : "Save"}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => setshowpreview((s) => !s)}
              >
                <span className="nav-icon">
                  {showonlypreview ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                <span className="nav-text">
                  {showonlypreview ? "Show Editor" : "Preview Only"}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={toggleTheme}>
                <span className="nav-icon">
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </span>
                <span className="nav-text">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button onClick={downloadZip} className="nav-link">
                <span className="nav-icon">
                  <Download size={18} />
                </span>
                <span className="nav-text">Download ZIP</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default EditorSidebar;
