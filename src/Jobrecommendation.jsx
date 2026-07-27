import axios from "axios";
import { useState } from "react";

const Jobrecommendation = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ShowAnalysis = async () => {
    if (!resumeFile) {
      setError("Please upload a resume first.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const formdata = new FormData();
      formdata.append("resume", resumeFile);

      const res = await axios.post(
        "https://localhost:7077/api/JobRecommendation",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
    
      );
      console.log("RES",res);

      // Handle both array response or object containing items array
      const results = Array.isArray(res.data) ? res.data : res.data?.jobs || [];
      setData(results);
    } catch (err) {
      console.error("Error", err);
      setError("Failed to fetch recommendations. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        setResumeFile(null);
        return;
      }
      setError("");
      setResumeFile(file);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
  };

  return (
    <div className="jr-page-wrapper">
      {/* Embedded CSS Styles */}
      <style>{`
        :root {
          --jr-primary: #4f46e5;
          --jr-primary-hover: #4338ca;
          --jr-bg: #f8fafc;
          --jr-card-bg: #ffffff;
          --jr-text: #0f172a;
          --jr-muted: #64748b;
          --jr-border: #e2e8f0;
          --jr-success: #10b981;
          --jr-success-bg: #ecfdf5;
          --jr-error: #ef4444;
        }

        .jr-page-wrapper * {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .jr-page-wrapper {
          min-height: 100vh;
          background-color: var(--jr-bg);
          padding: 40px 20px;
          color: var(--jr-text);
        }

        .jr-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .jr-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .jr-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--jr-text);
          margin-bottom: 8px;
        }

        .jr-header p {
          color: var(--jr-muted);
          font-size: 1rem;
        }

        .jr-upload-card {
          background: var(--jr-card-bg);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--jr-border);
          margin-bottom: 32px;
        }

        .jr-dropzone {
          position: relative;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 32px 20px;
          text-align: center;
          background: #f1f5f9;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .jr-dropzone:hover {
          border-color: var(--jr-primary);
          background: #eef2ff;
        }

        .jr-file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .jr-upload-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          display: block;
        }

        .jr-dropzone-title {
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--jr-text);
          margin-bottom: 4px;
        }

        .jr-dropzone-subtitle {
          font-size: 0.85rem;
          color: var(--jr-muted);
        }

        .jr-file-selected {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 20px;
        }

        .jr-file-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .jr-file-name {
          font-weight: 600;
          color: var(--jr-primary);
        }

        .jr-file-size {
          font-size: 0.85rem;
          color: var(--jr-muted);
        }

        .jr-remove-btn {
          background: none;
          border: none;
          color: var(--jr-error);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .jr-remove-btn:hover {
          background: #fee2e2;
        }

        .jr-error-banner {
          background: #fef2f2;
          color: var(--jr-error);
          border: 1px solid #fecaca;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }

        .jr-submit-btn {
          width: 100%;
          padding: 14px;
          background: var(--jr-primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .jr-submit-btn:hover:not(:disabled) {
          background: var(--jr-primary-hover);
        }

        .jr-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .jr-results-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .jr-section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .jr-job-card {
          background: var(--jr-card-bg);
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          border: 1px solid var(--jr-border);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .jr-job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
        }

        .jr-job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 12px;
        }

        .jr-job-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--jr-text);
          margin-bottom: 4px;
        }

        .jr-job-company {
          font-size: 0.95rem;
          color: var(--jr-muted);
          font-weight: 500;
        }

        .jr-match-badge {
          background: var(--jr-success-bg);
          color: var(--jr-success);
          font-weight: 700;
          font-size: 0.85rem;
          padding: 6px 12px;
          border-radius: 20px;
          white-space: nowrap;
          border: 1px solid #a7f3d0;
        }

        .jr-job-details {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          font-size: 0.9rem;
          color: var(--jr-muted);
          flex-wrap: wrap;
        }

        .jr-detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .jr-job-reason {
          background: #f8fafc;
          border-left: 3px solid var(--jr-primary);
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          font-size: 0.9rem;
          color: #334155;
          line-height: 1.5;
        }

        .jr-job-reason strong {
          color: var(--jr-primary);
        }

        .jr-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .jr-job-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="jr-container">
        {/* Header */}
        <div className="jr-header">
          <h1>AI Job Recommendations</h1>
          <p>Upload your resume to get personalized job matches based on your skills</p>
        </div>

        {/* Upload Card */}
        <div className="jr-upload-card">
          {error && <div className="jr-error-banner">{error}</div>}

          {!resumeFile ? (
            <div className="jr-dropzone">
              <input
                type="file"
                id="resumeUpload"
                className="jr-file-input"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <span className="jr-upload-icon">📄</span>
              <div className="jr-dropzone-title">
                Click or drag & drop to upload your Resume
              </div>
              <div className="jr-dropzone-subtitle">
                Supported Formats: PDF, DOC, DOCX (Max 5MB)
              </div>
            </div>
          ) : (
            <div className="jr-file-selected">
              <div className="jr-file-info">
                <span style={{ fontSize: "1.5rem" }}>📎</span>
                <div>
                  <div className="jr-file-name">{resumeFile.name}</div>
                  <div className="jr-file-size">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <button
                className="jr-remove-btn"
                onClick={handleRemoveFile}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          )}

          <button
            className="jr-submit-btn"
            onClick={ShowAnalysis}
            disabled={loading || !resumeFile}
          >
            {loading ? (
              <>
                <div className="jr-spinner"></div>
                Analyzing Resume...
              </>
            ) : (
              "Show Perfect Jobs via Resume Analysis"
            )}
          </button>
        </div>

        {/* Recommendations List */}
        {data.length > 0 && (
          <div className="jr-results-section">
            <h2 className="jr-section-title">
              Top Matches for You ({data.length})
            </h2>

            {data.map((job, index) => (
              <div key={job.jobId || index} className="jr-job-card">
                <div className="jr-job-header">
                  <div>
                    <h3 className="jr-job-title">{job.title}</h3>
                    <div className="jr-job-company">🏢 {job.company}</div>
                  </div>
                  {job.matchPercentage && (
                    <div className="jr-match-badge">
                      🎯 {job.matchPercentage}% Match
                    </div>
                  )}
                </div>

                <div className="jr-job-details">
                  {job.location && (
                    <span className="jr-detail-item">📍 {job.location}</span>
                  )}
                  {job.salary && (
                    <span className="jr-detail-item">💰 {job.salary}</span>
                  )}
                  {job.jobId && (
                    <span className="jr-detail-item">
                      🆔 Job ID: {job.jobId}
                    </span>
                  )}
                </div>

                {job.reason && (
                  <div className="jr-job-reason">
                    <strong>Why it matches: </strong>
                    {job.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobrecommendation;