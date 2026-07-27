import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShowApplications = () => {
  const { JobId } = useParams();
  const [data, setData] = useState([]);
  const [showShortlisted, setShowShortlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("");
  
  // Analysis States
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showid, setshowid] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const ResumeAnalysis = async (id) => {
    try {
      setAnalysisLoading(true);
      setshowid(id);
      const ndata = await axios.get(`https://localhost:7077/api/ResumeAnalysis/${id}`);
      console.log("Resume Analysis Result:", ndata.data);
      setAnalysisResult(ndata.data);
    } catch (err) {
      console.error("Error fetching resume analysis", err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const GetApplicants = async () => {
    setLoading(true);
    try {
      const url = showShortlisted
        ? `https://localhost:7077/api/JobApplications/job/${JobId}/shortlisted`
        : `https://localhost:7077/api/JobApplications/job/${JobId}`;

      const res = await axios.get(url);
      setData(res.data);

      // Try to get job title if available
      try {
        const jobRes = await axios.get(`https://localhost:7077/api/AdminJobs/${JobId}`);
        if (jobRes.data && jobRes.data.title) {
          setJobTitle(jobRes.data.title);
        }
      } catch (err) {
        console.log("Could not fetch job title");
      }
    } catch (err) {
      console.log("Error fetching applicants", err.message);
    } finally {
      setLoading(false);
    }
  };

  const ShortlistCandidate = async (id) => {
    try {
      await axios.put(`https://localhost:7077/api/JobApplications/shortlist/${id}`);
      setData((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isShortlisted: true } : a))
      );
    } catch (err) {
      console.log("Error shortlisting candidate", err.message);
    }
  };

  useEffect(() => {
    GetApplicants();
  }, [JobId, showShortlisted]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.mainTitle}>Applicants</h1>
          <p style={styles.subtitle}>
            {jobTitle ? `for "${jobTitle}"` : `Job ID: ${JobId}`}
          </p>
        </div>
        <div style={styles.headerRight}>
          <button
            style={showShortlisted ? styles.activeFilterBtn : styles.filterBtn}
            onClick={() => setShowShortlisted(!showShortlisted)}
          >
            <span style={styles.filterIcon}>
              {showShortlisted ? "✓" : "👥"}
            </span>
            {showShortlisted ? "Shortlisted Only" : "All Applicants"}
          </button>
          <div style={styles.stats}>
            <span style={styles.stat}>
              <strong>{data.length}</strong> Total
            </span>
            <span style={styles.stat}>
              <strong>{data.filter(d => d.isShortlisted).length}</strong> Shortlisted
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading applications...</p>
        </div>
      )}

      {/* No Applications State */}
      {!loading && data.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h3 style={styles.emptyTitle}>No Applications Found</h3>
          <p style={styles.emptyText}>
            {showShortlisted 
              ? "No shortlisted candidates for this job yet." 
              : "No applications have been submitted for this job yet."}
          </p>
        </div>
      )}

      {/* Applications Grid */}
      {!loading && data.length > 0 && (
        <div style={styles.applicationsGrid}>
          {data.map((e) => (
            <div key={e.id} style={styles.applicationCard}>
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={styles.applicantInfo}>
                  <div style={styles.applicantAvatar}>
                    {e.applicationName?.charAt(0) || "A"}
                  </div>
                  <div>
                    <h2 style={styles.applicantName}>{e.applicationName}</h2>
                    <p style={styles.applicantContact}>
                      <span style={styles.contactItem}>ID: {e.id}</span>
                    </p>
                    <p style={styles.applicantContact}>
                      <span style={styles.contactItem}>📧 {e.email}</span>
                      <span style={styles.contactItem}>📱 {e.mobileNo}</span>
                    </p>
                  </div>
                </div>
                <div style={styles.cardActions}>
                  {e.isShortlisted ? (
                    <span style={styles.shortlistedBadge}>
                      <span style={styles.badgeIcon}>✓</span>
                      Shortlisted
                    </span>
                  ) : (
                    <button
                      style={styles.shortlistBtn}
                      onClick={() => ShortlistCandidate(e.id)}
                    >
                      Shortlist
                    </button>
                  )}
                </div>
              </div>

              {/* Applicant Details */}
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Highest Qualification</span>
                  <span style={styles.detailValue}>{e.highestQualification || "Not specified"}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Skills</span>
                  <span style={styles.detailValue}>{e.skills || "Not specified"}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Address</span>
                  <span style={styles.detailValue}>{e.address || "Not specified"}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Willing to Relocate</span>
                  <span style={styles.detailValue}>
                    {e.isWillingToRelocate ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              {(e.linkedInProfile || e.gitHubProfile || e.portfolioUrl) && (
                <div style={styles.socialLinks}>
                  {e.linkedInProfile && (
                    <a
                      href={e.linkedInProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.socialLink}
                    >
                      <span style={styles.linkIcon}>💼</span>
                      LinkedIn
                    </a>
                  )}
                  {e.gitHubProfile && (
                    <a
                      href={e.gitHubProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.socialLink}
                    >
                      <span style={styles.linkIcon}>💻</span>
                      GitHub
                    </a>
                  )}
                  {e.portfolioUrl && (
                    <a
                      href={e.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.socialLink}
                    >
                      <span style={styles.linkIcon}>🎨</span>
                      Portfolio
                    </a>
                  )}
                </div>
              )}

              {/* Documents Section */}
              <div style={styles.documentsSection}>
                <h4 style={styles.documentsTitle}>Documents</h4>
                <div style={styles.documentsGrid}>
                  {e.resumeUrl && (
                    <div style={styles.documentCard}>
                      <div style={styles.documentIcon}>📄</div>
                      <div style={styles.documentInfo}>
                        <span style={styles.documentName}>Resume</span>
                        <a
                          href={e.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.documentLink}
                        >
                          View/Download
                        </a>
                      </div>
                    </div>
                  )}
                  {e.photographUrl && (
                    <div style={styles.documentCard}>
                      <div style={styles.documentIcon}>📸</div>
                      <div style={styles.documentInfo}>
                        <span style={styles.documentName}>Photograph</span>
                        <a
                          href={e.photographUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.documentLink}
                        >
                          View
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis Action Button */}
                {e.resumeUrl && showid !== e.id && (
                  <button
                    style={styles.analysisBtn}
                    onClick={() => ResumeAnalysis(e.id)}
                  >
                    ✨ Run AI Resume Analysis
                  </button>
                )}
              </div>

              {/* AI Analysis Result Section */}
              {showid === e.id && (
                <div style={styles.analysisContainer}>
                  <div style={styles.analysisHeader}>
                    <h4 style={styles.analysisTitle}>🤖 AI Resume Analysis</h4>
                    {analysisResult?.analysis?.matchPercentage && (
                      <span style={styles.matchScoreBadge}>
                        {analysisResult.analysis.matchPercentage} Match
                      </span>
                    )}
                  </div>

                  {analysisLoading ? (
                    <p style={{ fontSize: "13px", color: "#666" }}>Analyzing resume content...</p>
                  ) : (
                    analysisResult && (
                      <div style={styles.analysisBody}>
                        {/* Summary Badges */}
                        <div style={styles.metaRow}>
                          {analysisResult.candidate && (
                            <span style={styles.metaBadge}>Candidate: {analysisResult.candidate}</span>
                          )}
                          {analysisResult.role && (
                            <span style={styles.metaBadge}>Role: {analysisResult.role}</span>
                          )}
                        </div>

                        {/* Analysis Grid */}
                        <div style={styles.analysisGrid}>
                          {analysisResult.analysis?.strengths && (
                            <div style={styles.analysisBox}>
                              <h5 style={styles.boxTitleGreen}>💪 Strengths</h5>
                              <p style={styles.boxText}>{analysisResult.analysis.strengths}</p>
                            </div>
                          )}

                          {analysisResult.analysis?.weaknesses && (
                            <div style={styles.analysisBox}>
                              <h5 style={styles.boxTitleRed}>⚠️ Areas for Notice</h5>
                              <p style={styles.boxText}>{analysisResult.analysis.weaknesses}</p>
                            </div>
                          )}

                          {analysisResult.analysis?.improvements && (
                            <div style={styles.analysisBox}>
                              <h5 style={styles.boxTitleBlue}>📈 Suggested Improvements</h5>
                              <p style={styles.boxText}>{analysisResult.analysis.improvements}</p>
                            </div>
                          )}

                          {analysisResult.analysis?.companyFitAnalysis && (
                            <div style={styles.analysisBox}>
                              <h5 style={styles.boxTitlePurple}>🏢 Culture & Company Fit</h5>
                              <p style={styles.boxText}>{analysisResult.analysis.companyFitAnalysis}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Card Footer */}
              <div style={styles.cardFooter}>
                <span style={styles.applicationDate}>
                  Applied on {new Date(e.appliedOn).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                {!e.isShortlisted && (
                  <button
                    style={styles.shortlistBtnSmall}
                    onClick={() => ShortlistCandidate(e.id)}
                  >
                    Shortlist Candidate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f2f1",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    backgroundColor: "white",
    padding: "24px 32px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  mainTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0a66c2",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    margin: "0",
  },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "12px",
  },
  filterBtn: {
    backgroundColor: "white",
    color: "#0a66c2",
    border: "1px solid #0a66c2",
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  },
  activeFilterBtn: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "1px solid #0a66c2",
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  },
  filterIcon: {
    fontSize: "16px",
  },
  stats: {
    display: "flex",
    gap: "20px",
    fontSize: "14px",
  },
  stat: {
    color: "#666",
  },
  loading: {
    textAlign: "center",
    padding: "60px 20px",
  },
  spinner: {
    border: "4px solid rgba(10, 102, 194, 0.1)",
    borderRadius: "50%",
    borderTop: "4px solid #0a66c2",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    backgroundColor: "white",
    margin: "24px",
    borderRadius: "12px",
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#666",
    maxWidth: "400px",
    margin: "0 auto",
  },
  applicationsGrid: {
    padding: "24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
    gap: "24px",
  },
  applicationCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f0f0f0",
  },
  applicantInfo: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  applicantAvatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#0a66c2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "600",
  },
  applicantName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 4px 0",
  },
  applicantContact: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    margin: 0,
  },
  contactItem: {
    fontSize: "13px",
    color: "#666",
  },
  cardActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
  shortlistedBadge: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  badgeIcon: {
    fontSize: "14px",
  },
  shortlistBtn: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
  },
  detailLabel: {
    fontSize: "12px",
    color: "#666",
    fontWeight: "600",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailValue: {
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.5",
  },
  socialLinks: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#f0f7ff",
    color: "#0a66c2",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
  },
  linkIcon: {
    fontSize: "16px",
  },
  documentsSection: {
    marginBottom: "20px",
  },
  documentsTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px",
  },
  documentsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "12px",
  },
  documentCard: {
    backgroundColor: "#f8f9fa",
    padding: "12px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  documentIcon: {
    fontSize: "24px",
  },
  documentInfo: {
    display: "flex",
    flexDirection: "column",
  },
  documentName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  documentLink: {
    fontSize: "12px",
    color: "#0a66c2",
    textDecoration: "none",
    fontWeight: "500",
  },
  analysisBtn: {
    width: "100%",
    backgroundColor: "#f3f0ff",
    color: "#6b21a8",
    border: "1px solid #d8b4fe",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  /* Analysis Section Styles */
  analysisContainer: {
    backgroundColor: "#fafafc",
    border: "1px solid #e9e3ff",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "20px",
  },
  analysisHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  analysisTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#4c1d95",
    margin: 0,
  },
  matchScoreBadge: {
    backgroundColor: "#059669",
    color: "white",
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "12px",
  },
  analysisBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  metaRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  metaBadge: {
    fontSize: "12px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  analysisGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  analysisBox: {
    backgroundColor: "white",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #f3f4f6",
  },
  boxTitleGreen: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#166534",
    margin: "0 0 4px 0",
  },
  boxTitleRed: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#991b1b",
    margin: "0 0 4px 0",
  },
  boxTitleBlue: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#1e40af",
    margin: "0 0 4px 0",
  },
  boxTitlePurple: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#6b21a8",
    margin: "0 0 4px 0",
  },
  boxText: {
    fontSize: "13px",
    color: "#4b5563",
    margin: 0,
    lineHeight: "1.4",
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "20px",
    borderTop: "1px solid #f0f0f0",
  },
  applicationDate: {
    fontSize: "13px",
    color: "#666",
  },
  shortlistBtnSmall: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

// Add keyframes for spinner animation
if (typeof document !== "undefined") {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    try {
      styleSheet.insertRule(`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `, styleSheet.cssRules.length);
    } catch (e) {
      // Ignore duplicates
    }
  }
}

export default ShowApplications;