import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "investor"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await API.post("/auth/register", formData);

      alert("Registration successful! Please login.");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "investor"
      });

      navigate("/login");

    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>

          <div style={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <div style={styles.formGroup}>
            <label>Role</label>
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="investor"
                  checked={formData.role === "investor"}
                  onChange={handleChange}
                />
                Investor
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                />
                Admin
              </label>
            </div>
          </div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.loginLink}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "85vh",
    backgroundColor: "#f5f7fa"
  },
  card: {
    width: "380px",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column"
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "5px"
  },
  radioGroup: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "8px"
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  loginText: {
    textAlign: "center",
    marginTop: "15px"
  },
  loginLink: {
    color: "#d32f2f",
    textDecoration: "none",
    fontWeight: "bold"
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "5px"
  }
};

export default Register;


