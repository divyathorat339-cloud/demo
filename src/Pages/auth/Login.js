// src/Pages/user/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import bgImage from "../../image/bgg7.jpg";
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ If redirected from Book Now, it will contain the original path
  const from = location.state?.from || "/home";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setPopup({ show: true, message: "✅ Login Successful! 🎉", type: "success" });
      setTimeout(() => {
        setPopup({ show: false, message: "", type: "" });
        // ✅ Redirects back to the original page (e.g., /book/:id)
        navigate(from, { replace: true });
      }, 2000);
    } catch (err) {
      setLoading(false);
      setPopup({
        show: true,
        message: "❌ Invalid credentials!",
        type: "error",
      });
      setTimeout(() => {
        setPopup({ show: false, message: "", type: "" });
      }, 2000);
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-container">
        {/* Loading Popup */}
        {loading && (
          <div className="popup-overlay">
            <div className="popup-box">
              <div className="spinner"></div>
              <p>Logging in...</p>
            </div>
          </div>
        )}

        {/* Success/Error Popup */}
        {popup.show && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p className={popup.type === "success" ? "success" : "error"}>
                {popup.message}
              </p>
            </div>
          </div>
        )}

        <div className="login-card">
          <h2 className="heading">Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="button" type="submit">
              Login
            </button>
          </form>
          <p className="footer">
            Don't have an account?{" "}
            <Link className="link" to="/Register">
              Register
            </Link>
          </p>
          <p className="footer">
            <Link className="link" to="/auth/forgotpassword">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>

      <Footer />
      <style>
        {`
          /* Same CSS as before, unchanged */
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            min-height: 100vh;
            background-image: url(${bgImage});
            background-size: cover;
            background-position: center;
            font-family: 'Poppins', sans-serif;
            padding-top: 20px;
          }

          .login-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            width: 360px;
            text-align: center;
            animation: fadeIn 0.6s ease-in-out;
          }

          .heading {
            margin-bottom: 25px;
            color: #ff7b54;
            font-weight: 700;
            font-size: 24px;
          }

          .input {
            width: 95%;
            padding: 12px 15px;
            margin-bottom: 20px;
            border-radius: 10px;
            border: 1px solid #ddd;
            outline: none;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .input:focus {
            border-color: #ff7b54;
            box-shadow: 0 0 8px #ff7b54;
          }

          .button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(90deg, #ff7b54, #ffb347);
            color: #fff;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255,123,84,0.4);
          }

          .footer {
            margin-top: 15px;
            font-size: 14px;
          }

          .link {
            color: #ff7b54;
            font-weight: 500;
            text-decoration: none;
          }

          .link:hover {
            text-decoration: underline;
          }

          .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0,0,0,0.4);
            z-index: 1000;
            animation: fadeIn 0.3s ease-in-out;
          }

          .popup-box {
            background: #fff;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            text-align: center;
            font-size: 16px;
            font-weight: 500;
            min-width: 250px;
            animation: scaleUp 0.3s ease-in-out;
          }

          .success { color: green; }
          .error { color: red; }

          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff7b54;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleUp {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </>
  );
}
