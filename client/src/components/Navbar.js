import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>📈 Stock Portfolio Manager</h2>

      {user && (
        <div style={styles.links}>
          <Link style={styles.link} to="/dashboard">Dashboard</Link>
          <Link style={styles.link} to="/stocks">Stocks</Link>
          <Link style={styles.link} to="/portfolio">My Portfolio</Link>

          {user.role === "admin" && (
            <Link style={styles.link} to="/admin">Admin</Link>
          )}

          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    background: "#111",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white"
  },
  logo: {
    margin: 0
  },
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center"
  },
  link: {
    color: "white",
    textDecoration: "none"
  },
  logout: {
    background: "crimson",
    border: "none",
    padding: "6px 12px",
    color: "white",
    cursor: "pointer"
  }
};

export default Navbar;

