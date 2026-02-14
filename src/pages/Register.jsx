import React, { useState } from "react";
import { registerUser } from "../api/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const HandleSubmit = async (e) => {
    e.preventDefault();
     const k=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!k.test(email)){
      alert("Enter Valid Email");
      return;
    }
    if(!password.length>=6){
      alert("Enter Password of Length");
      return;
    }
    try {
      await registerUser(email, password);
      setMsg("✅ Registration successful");
      navigate("/Login");
    } catch {
      setMsg("❌ Already Registered, Login Instead");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f6f7f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#2d2d2d",
            marginBottom: "8px",
          }}
        >
          Create an account
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#6f6f6f",
            marginBottom: "24px",
          }}
        >
          Find jobs, upload resumes, and grow your career
        </p>

        <form onSubmit={HandleSubmit}>
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            Email address
          </label>
          <input
            type="text"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              borderRadius: "4px",
              border: "1px solid #bdbdbd",
              fontSize: "14px",
            }}
          />

          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            placeholder="Minimum 6 characters"
            onChange={(e) => setPassword(e.target.value)}
     
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "22px",
              borderRadius: "4px",
              border: "1px solid #bdbdbd",
              fontSize: "14px",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2557a7",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/Login")}
            style={{
              color: "#2557a7",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Sign in
          </span>
        </div>

        {msg && (
          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              color: msg.includes("✅") ? "green" : "red",
              textAlign: "center",
            }}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
