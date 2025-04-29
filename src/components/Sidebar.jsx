import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ dark, setdarktheme, showonlypreview, setshowpreview }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <h2>Markdown</h2>
          <h2>Magic</h2>
        </div>
        <button
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-title">Editor</h3>
          <ul className="nav-items">
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => setshowpreview((s) => !s)}
              >
                <span className="nav-icon">
                  {showonlypreview ? "✏️" : "👁️"}
                </span>
                <span className="nav-text">
                  {showonlypreview ? "Show Editor" : "Show Preview"}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => setdarktheme((d) => !d)}
              >
                <span className="nav-icon">{dark ? "☀️" : "🌙"}</span>
                <span className="nav-text">
                  {dark ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
