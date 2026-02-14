import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShowApplications = () => {
  const { JobId } = useParams();
  const [data, setData] = useState([]);
  const [showShortlisted, setShowShortlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("");

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
              </div>

              {/* Footer */}
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
    "&:hover": {
      backgroundColor: "#f0f7ff",
    },
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
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "24px",
  },
  applicationCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e0e0e0",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    },
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
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#004182",
    },
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
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#e1f0ff",
      transform: "translateY(-1px)",
    },
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
    "&:hover": {
      textDecoration: "underline",
    },
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
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#004182",
    },
  },
};

// Add keyframes for spinner animation
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);
}

export default ShowApplications;