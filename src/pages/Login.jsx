import React, { useState } from "react";
import { loginUser, registerUser } from "../api/authService";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [role,setrole]=useState("");


  const HandleSubmit = async (e) => {
    const k=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!k.test(email)){
      alert("Enter Valid Email");
      return;
    }
    e.preventDefault();
    try {
    
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.accessToken);
      console.log(data.accessToken);
      alert("✅ Login successful");
      if(role==="Admin"){
        navigate("/Admin");
      }
      if(role==="User"){
        navigate("/User");
      }
    } catch(error) {
      if(error?.response?.status===404||error?.response?.status===401){
          setMsg("❌ User not registered. Please register first");
      }
      else{
      alert("❌ Invalid email or password");
      }
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
          Sign in
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#6f6f6f",
            marginBottom: "24px",
          }}
        >
          Access your account and continue your job search
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
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
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


<div style={{ marginBottom: "28px" }}>
  <label
    style={{
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "8px",
    }}
  >
    Select Role
  </label>

  <select
    value={role}
    onChange={(e) => setrole(e.target.value)}
    required
    style={{
      width: "100%",
      padding: "14px 16px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "15px",
      backgroundColor: "#fafafa",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 16px center",
      backgroundSize: "16px",
      paddingRight: "40px",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
    }}
    onFocus={(e) => {
      e.target.style.borderColor = "#2557a7";
      e.target.style.backgroundColor = "#fff";
      e.target.style.boxShadow = "0 0 0 3px rgba(37, 87, 167, 0.1)";
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "#ddd";
      e.target.style.backgroundColor = "#fafafa";
      e.target.style.boxShadow = "none";
    }}
  >
    <option value="">Choose your role</option>
    <option value="Admin">Admin</option>
    <option value="User">User</option>
  </select>
</div>

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
            Sign in
          </button>
        </form>

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

export default Login;
