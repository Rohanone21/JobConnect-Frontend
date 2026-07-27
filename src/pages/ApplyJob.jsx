import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ApplyJob = () => {
  const navigate = useNavigate();
  const { JobId } = useParams();

  /* ============================
     State Management
  ============================ */
  const [isApplied, setIsApplied] = useState(() => {
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || {};
    return appliedJobs[JobId] === true;
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    applicationName: "",
    mobileNo: "",
    address: "",
    email: "",
    highestQualification: "",
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
     Form Handlers
  ============================ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
   
    const file=e.target.files[0];
    if(file){
      if(file.size>5 * 1024 * 1024){
        alert("File size Exceeds 5MB Limit");
        return;
      }
      setResumeFile(file);
    }
  };

  const ApplyJobs = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert("Please select a resume file to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Ensure JobId is parsed as an integer for C# DTO binding
      formData.append("JobId", parseInt(JobId, 10));

      // ✅ Key Fix: Match property name 'ResumeUrl' expected by ApplyJobDto
      formData.append("ResumeUrl", resumeFile);

      // Append text inputs with PascalCase matching ASP.NET C# properties
      formData.append("ApplicationName", form.applicationName);
      formData.append("MobileNo", form.mobileNo);
      formData.append("Address", form.address);
      formData.append("Email", form.email);
      formData.append("HighestQualification", form.highestQualification);
      formData.append("Skills", form.skills);
      formData.append("PhotographUrl", form.photographUrl || "");
      formData.append("LinkedInProfile", form.linkedInProfile || "");
      formData.append("GitHubProfile", form.gitHubProfile || "");
      formData.append("PortfolioUrl", form.portfolioUrl || "");
      formData.append("IsWillingToRelocate", form.isWillingToRelocate);
      formData.append("IsApplied", true);

      // ✅ Match your backend URL endpoint
      await axios.post(
        "https://localhost:7077/api/JobApplications/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save applied state in local storage
      const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || {};
      appliedJobs[JobId] = true;
      localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

      setIsApplied(true);
      alert("✅ Job Applied Successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      if (error.response && error.response.data) {
        console.error("Validation Errors:", error.response.data.errors || error.response.data);
        alert(`❌ Error 400: ${JSON.stringify(error.response.data.errors || error.response.data)}`);
      } else {
        alert("❌ Submission failed. Please check network connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Apply for Job</h1>
          <span style={styles.jobBadge}>Job ID: #{JobId}</span>
        </div>

        {/* ================= APPLICATION FORM ================= */}
        {!isApplied ? (
          <form onSubmit={ApplyJobs} style={styles.form}>
            {/* Personal Details */}
            <h2 style={styles.sectionTitle}>Personal Details</h2>
            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  required
                  style={styles.input}
                  placeholder="e.g. John Doe"
                  name="applicationName"
                  value={form.applicationName}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  required
                  style={styles.input}
                  placeholder="john@example.com"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Mobile Number * (Max 10 digits)</label>
                <input
                  required
                  maxLength={10}
                  style={styles.input}
                  placeholder="9876543210"
                  name="mobileNo"
                  value={form.mobileNo}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Highest Qualification *</label>
                <select
                  required
                  name="highestQualification"
                  value={form.highestQualification}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select Qualification</option>
                  <option value="BE">BE</option>
                  <option value="BTECH">B.Tech</option>
                  <option value="MTECH">M.Tech</option>
                  <option value="MCS">MCS</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                </select>
              </div>
            </div>

            {/* Resume Upload Dropzone */}
            <h2 style={styles.sectionTitle}>Resume Upload *</h2>
            <div style={styles.fileBox}>
              <input
              type="file"
              id="resumeUpload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={styles.fileInputHidden}
              />
              <label htmlFor="resumeUpload" style={styles.fileLabel}>
                <svg
                  style={styles.uploadIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span style={styles.fileTextPrimary}>
                  {resumeFile ? resumeFile.name : "Click here to upload your Resume"}
                </span>
                <span style={styles.fileTextSecondary}>
                  {resumeFile
                    ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB`
                    : "Supported Formats: PDF, DOC, DOCX (Max 5MB)"}
                </span>
              </label>
            </div>

            {/* Professional Details & Links */}
            <h2 style={styles.sectionTitle}>Skills & Profiles</h2>
            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Primary Skills *</label>
                <input
                  required
                  style={styles.input}
                  placeholder="React, C#, SQL, Node.js"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>LinkedIn Profile</label>
                <input
                  style={styles.input}
                  placeholder="https://linkedin.com/in/username"
                  name="linkedInProfile"
                  value={form.linkedInProfile}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>GitHub Profile</label>
                <input
                  style={styles.input}
                  placeholder="https://github.com/username"
                  name="gitHubProfile"
                  value={form.gitHubProfile}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Portfolio Link</label>
                <input
                  style={styles.input}
                  placeholder="https://myportfolio.com"
                  name="portfolioUrl"
                  value={form.portfolioUrl}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Photograph URL (Optional)</label>
              <input
                style={styles.input}
                placeholder="https://example.com/photo.jpg"
                name="photographUrl"
                value={form.photographUrl}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Residential Address *</label>
              <textarea
                required
                style={styles.textarea}
                placeholder="Enter complete residential address..."
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div style={styles.checkboxRow}>
              <input
                type="checkbox"
                id="relocate"
                name="isWillingToRelocate"
                checked={form.isWillingToRelocate}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <label htmlFor="relocate" style={styles.checkboxText}>
                I am willing to relocate for this position
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitBtn,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </button>
          </form>
        ) : (
          /* ================= APPLIED SUCCESS VIEW ================= */
          <div style={styles.appliedState}>
            <div style={styles.successIconBox}>
              <svg
                style={styles.successIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 style={{ fontSize: "22px", margin: "14px 0 6px 0", color: "#111827" }}>
              Application Submitted!
            </h2>
            <p style={{ color: "#6B7280", margin: "0 0 24px 0", fontSize: "14px" }}>
              Your application for Job ID #{JobId} has been successfully recorded. Click below to take your technical assessment.
            </p>

            <button
              style={styles.assessmentBtn}
              onClick={() => navigate(`/quiz/${JobId}`)}
            >
              Start Assessment Test →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F3F4F6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  card: {
    background: "#FFFFFF",
    width: "100%",
    maxWidth: "720px",
    padding: "36px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
    border: "1px solid #E5E7EB",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "16px",
    marginBottom: "20px",
    borderBottom: "1px solid #E5E7EB",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  jobBadge: {
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#4B5563",
    margin: "8px 0 0 0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    fontSize: "14px",
    color: "#1F2937",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    fontSize: "14px",
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    fontSize: "14px",
    color: "#1F2937",
    minHeight: "70px",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  fileBox: {
    border: "2px dashed #D1D5DB",
    borderRadius: "8px",
    backgroundColor: "#F9FAFB",
    padding: "20px",
    textAlign: "center",
  },
  fileInputHidden: {
    display: "none",
  },
  fileLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
  uploadIcon: {
    width: "36px",
    height: "36px",
    color: "#9CA3AF",
    marginBottom: "8px",
  },
  fileTextPrimary: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2563EB",
  },
  fileTextSecondary: {
    fontSize: "12px",
    color: "#6B7280",
    marginTop: "4px",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#2563EB",
    cursor: "pointer",
  },
  checkboxText: {
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    marginTop: "8px",
  },
  appliedState: {
    textAlign: "center",
    padding: "24px 10px",
  },
  successIconBox: {
    width: "56px",
    height: "56px",
    backgroundColor: "#D1FAE5",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  successIcon: {
    width: "28px",
    height: "28px",
    color: "#059669",
  },
  assessmentBtn: {
    padding: "12px 24px",
    backgroundColor: "#059669",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default ApplyJob;