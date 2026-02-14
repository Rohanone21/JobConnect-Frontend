import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ApplyJob = () => {
  const navigate = useNavigate();
  const { JobId } = useParams();

  /* ============================
     Job-wise Applied State
  ============================ */
  const [isApplied, setIsApplied] = useState(() => {
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || {};
    return appliedJobs[JobId] === true;
  });

  /* ============================
     Form State
  ============================ */
  const [form, setForm] = useState({
    applicationName: "",
    mobileNo: "",
    address: "",
    email: "",
    highestQualification: "",
    resumeUrl: "",
    photographUrl: "",
    skills: "",
    linkedInProfile: "",
    gitHubProfile: "",
    portfolioUrl: "",
    isWillingToRelocate: false,
  });

  /* ============================
     Reset state on JobId change
  ============================ */
  useEffect(() => {
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || {};
    setIsApplied(appliedJobs[JobId] === true);
  }, [JobId]);

  /* ============================
     Input Handler
  ============================ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ============================
     Apply Job
  ============================ */
  const ApplyJobs = async () => {
    const payload = {
      jobId: JobId,
      ...form,
      IsApplied: true,
    };

    await axios.post(
      "https://localhost:7080/api/UserJobApplications/apply",
      payload
    );

    // Save job-wise applied status
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || {};
    appliedJobs[JobId] = true;
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

    setIsApplied(true);
    alert("✅ Job Applied Successfully");
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={heading}>Apply for Job</h1>
        <p style={jobId}>Job ID: {JobId}</p>

        {/* ================= FORM ================= */}
        {!isApplied && (
          <>
            <div style={grid}>
              <input style={input} placeholder="Full Name" name="applicationName" value={form.applicationName} onChange={handleChange} />
              <input style={input} placeholder="Mobile Number" name="mobileNo" value={form.mobileNo} onChange={handleChange} />
              <input style={input} placeholder="Email" name="email" type="email" value={form.email} onChange={handleChange} />

              <select name="highestQualification" value={form.highestQualification} onChange={handleChange} style={input}>
                <option value="">Select Qualification</option>
                <option value="BE">BE</option>
                <option value="BTECH">BTECH</option>
                <option value="MTECH">MTECH</option>
                <option value="MCS">MCS</option>
              </select>

              <input style={input} placeholder="Skills" name="skills" value={form.skills} onChange={handleChange} />
              <input style={input} placeholder="Resume URL" name="resumeUrl" value={form.resumeUrl} onChange={handleChange} />
              <input style={input} placeholder="Photograph URL" name="photographUrl" value={form.photographUrl} onChange={handleChange} />
              <input style={input} placeholder="LinkedIn Profile" name="linkedInProfile" value={form.linkedInProfile} onChange={handleChange} />
              <input style={input} placeholder="GitHub Profile" name="gitHubProfile" value={form.gitHubProfile} onChange={handleChange} />
              <input style={input} placeholder="Portfolio URL" name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} />
            </div>

            <textarea style={textarea} placeholder="Address" name="address" value={form.address} onChange={handleChange} />

            <div style={checkboxRow}>
              <input type="checkbox" name="isWillingToRelocate" checked={form.isWillingToRelocate} onChange={handleChange} />
              <span style={checkboxText}>Willing to Relocate</span>
            </div>

            <button style={applyBtn} onClick={ApplyJobs}>
              Apply Job
            </button>
          </>
        )}

        {/* ================= APPLIED VIEW ================= */}
        {isApplied && (
          <>
            <button style={{ ...applyBtn, background: "green" }} disabled>
              Applied Successfully
            </button>

            <button style={applyBtn} onClick={() => navigate(`/quiz/${JobId}`)}>
              Start Test
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  backgroundColor: "#f3f2f1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "30px",
};

const card = {
  background: "#fff",
  width: "700px",
  padding: "30px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,.1)",
};

const heading = { fontSize: "26px", fontWeight: "700" };
const jobId = { fontSize: "13px", color: "#666", marginBottom: "20px" };

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
};

const input = { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" };
const textarea = { width: "100%", marginTop: "14px", padding: "10px", height: "80px" };

const checkboxRow = { display: "flex", alignItems: "center", marginTop: "14px" };
const checkboxText = { marginLeft: "8px" };

const applyBtn = {
  width: "100%",
  marginTop: "22px",
  padding: "12px",
  background: "#2557a7",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

export default ApplyJob;
