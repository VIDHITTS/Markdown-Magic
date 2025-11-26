import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Sun, Moon, LogOut, User, Mail } from "lucide-react";
import "../styles/Profile.css";

const Profile = ({ user, setUser, theme, toggleTheme }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            navigate("/");
        } catch (error) {
        }
    };

    if (!user) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <nav className="profile-nav">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <button
                    onClick={toggleTheme}
                    className="theme-toggle-btn"
                    title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </nav>

            <div className="profile-content">
                <motion.div
                    className="profile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <h1>Profile Settings</h1>
                    </div>

                    <div className="profile-info">
                        <div className="info-group">
                            <div className="info-label">
                                <User size={18} />
                                <span>Full Name</span>
                            </div>
                            <div className="info-value">{user?.name || "Not set"}</div>
                        </div>

                        <div className="info-group">
                            <div className="info-label">
                                <User size={18} />
                                <span>Username</span>
                            </div>
                            <div className="info-value">{user?.username || "Not set"}</div>
                        </div>

                        <div className="info-group">
                            <div className="info-label">
                                <Mail size={18} />
                                <span>Email</span>
                            </div>
                            <div className="info-value">{user?.email || "Not set"}</div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="logout-btn" onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;