import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Code,
  Zap,
  Save,
  Eye,
  Download,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import "../styles/Home.css";

const Home = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Code size={32} />,
      title: "Live Code Editor",
      description: "Write HTML, CSS, and JavaScript with instant preview",
    },
    {
      icon: <Zap size={32} />,
      title: "Real-time Preview",
      description: "See your changes instantly as you type",
    },
    {
      icon: <Save size={32} />,
      title: "Auto-save",
      description: "Never lose your work with automatic saving",
    },
    {
      icon: <Eye size={32} />,
      title: "Project Management",
      description: "Organize and manage all your projects in one place",
    },
    {
      icon: <Download size={32} />,
      title: "Export Projects",
      description: "Download your projects as ZIP files anytime",
    },
    {
      icon: <Palette size={32} />,
      title: "Beautiful Themes",
      description: "Switch between elegant light and dark themes",
    },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>

        <nav className="home-nav">
          <div className="nav-logo">
            <h1>
              <span className="logo-mark">Snap</span>
              <span className="logo-magic">Code</span>
            </h1>
          </div>
          <div className="nav-buttons">
            <button
              className="nav-btn theme-btn"
              onClick={toggleTheme}
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="nav-btn browse-btn"
              onClick={() => navigate("/browse")}
            >
              Browse
            </button>
            <button
              className="nav-btn login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="nav-btn signup-btn"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </nav>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Code, Preview, and Create
            <span className="hero-highlight"> Instantly</span>
          </h1>
          <p className="hero-subtitle">
            A modern code editor for HTML, CSS, and JavaScript with live preview
            and powerful project management
          </p>
          <div className="hero-actions">
            <button
              className="cta-button primary"
              onClick={() => navigate("/register")}
            >
              Get Started Free
            </button>
            <button
              className="cta-button secondary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="editor-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="mockup-tabs">
                <span className="tab active">HTML</span>
                <span className="tab">CSS</span>
                <span className="tab">JS</span>
              </div>
            </div>
            <div className="mockup-content">
              <div className="code-line">
                <span className="code-tag">&lt;div</span>
                <span className="code-attr"> className</span>
                <span className="code-value">="hero"</span>
                <span className="code-tag">&gt;</span>
              </div>
              <div className="code-line indent">
                <span className="code-tag">&lt;h1&gt;</span>
                <span className="code-text">Hello World</span>
                <span className="code-tag">&lt;/h1&gt;</span>
              </div>
              <div className="code-line">
                <span className="code-tag">&lt;/div&gt;</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Everything You Need to Code</h2>
          <p>Powerful features to enhance your coding experience</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Start Coding?</h2>
          <p>Join thousands of developers creating amazing projects</p>
          <button
            className="cta-button primary large"
            onClick={() => navigate("/register")}
          >
            Create Free Account
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>
              <span className="logo-mark">Snap</span>
              <span className="logo-magic">Code</span>
            </h3>
            <p>Code, Preview, Create</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 SnapCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
