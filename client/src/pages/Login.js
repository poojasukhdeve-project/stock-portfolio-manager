import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      // 🔥 login must return user
      const user = await login(email, password);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.registerText}>
          No account?{" "}
          <Link to="/register" style={styles.registerLink}>
            Register
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
    width: "350px",
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
  registerText: {
    textAlign: "center",
    marginTop: "15px"
  },
  registerLink: {
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

export default Login;
