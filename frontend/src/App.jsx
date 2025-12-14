import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Editor from "./pages/Editor.jsx";
import Profile from "./pages/Profile.jsx";
import Browse from "./pages/Browse.jsx";
import LikedProjects from "./pages/LikedProjects.jsx";
import { API_URL } from "./config/api.js";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "dark";
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      return newTheme;
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid var(--muted)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Home theme={theme} toggleTheme={toggleTheme} />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login
                setUser={setUser}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register
                setUser={setUser}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                user={user}
                setUser={setUser}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile
                user={user}
                setUser={setUser}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/browse"
          element={
            <Browse user={user} theme={theme} toggleTheme={toggleTheme} />
          }
        />
        <Route
          path="/liked"
          element={
            user ? (
              <LikedProjects
                user={user}
                setUser={setUser}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/editor/:id"
          element={
            user ? (
              <Editor user={user} theme={theme} toggleTheme={toggleTheme} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/editor"
          element={
            user ? (
              <Editor user={user} theme={theme} toggleTheme={toggleTheme} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
