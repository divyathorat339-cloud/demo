import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase"; 
import { ref, set } from "firebase/database"; 
import bgImage from "../../image/bg3.jpg";
export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false); 
  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true); 
     try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const time = new Date().toISOString();
      await set(ref(db, "adminLogins/" + user.uid), {
        email: user.email,
        lastLogin: time,
      });
      nav("/admin"); 
    } catch (error) {
      console.error(error.code, error.message);
      setErr(error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {err && (
          <p style={{ color: "red", marginTop: "15px", fontSize: "14px" }}>
            {err}
          </p>
        )}
      </div>
    </div>
  );
}
