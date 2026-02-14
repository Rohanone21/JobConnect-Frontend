import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyReview = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");

  const GetCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://localhost:7163/api/Companies");
      setCompanies(res.data);
      setError("");
    } catch (err) {
      console.log("Data not found", err.message);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get unique industries for filter
  const industries = [...new Set(companies.map(company => company.industry).filter(Boolean))];

  // Filter companies based on search and filter
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.headquarters?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = !filterIndustry || company.industry === filterIndustry;
    
    return matchesSearch && matchesIndustry;
  });

  useEffect(() => {
    GetCompanies();
  }, []);

  const IndustryFilterBadge = ({ industry, count, isActive, onClick }) => (
    <button
      style={isActive ? styles.activeFilterBadge : styles.filterBadge}
      onClick={() => onClick(industry)}
    >
      {industry}
      <span style={styles.filterCount}>{count}</span>
    </button>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerText}>
            <h1 style={styles.title}>Company Directory</h1>
            <p style={styles.subtitle}>
              Discover top companies and find your perfect workplace match
            </p>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{companies.length}</span>
              <span style={styles.statLabel}>Total Companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div style={styles.controlsBar}>
        <div style={styles.controlsContent}>
          <div style={styles.searchBox}>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search companies by name, industry, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          
          <div style={styles.filterSelectContainer}>
            <select
              style={styles.filterSelect}
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
            >
              <option value="">All Industries</option>
              {industries.map((industry, index) => (
                <option key={index} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinnerContainer}>
              <div style={styles.spinner}></div>
            </div>
            <p style={styles.loadingText}>Loading companies...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={styles.errorContainer}>
            <div style={styles.errorContent}>
              <div style={styles.errorIcon}>⚠️</div>
              <h3 style={styles.errorTitle}>Unable to load companies</h3>
              <p style={styles.errorMessage}>{error}</p>
              <button style={styles.retryButton} onClick={GetCompanies}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Companies Grid */}
        {!loading && !error && (
          <>
            {/* Results Header */}
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>
                Featured Companies {filteredCompanies.length > 0 && `(${filteredCompanies.length})`}
              </h2>
              <div style={styles.resultsInfo}>
                {searchTerm && (
                  <span style={styles.searchInfo}>
                    Search: "{searchTerm}"
                  </span>
                )}
                {filterIndustry && (
                  <span style={styles.filterInfo}>
                    Industry: {filterIndustry}
                    <button 
                      style={styles.clearFilter}
                      onClick={() => setFilterIndustry("")}
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Industry Filters */}
            {industries.length > 0 && (
              <div style={styles.industryFilters}>
                <span style={styles.filterLabel}>Quick filters:</span>
                <IndustryFilterBadge 
                  industry="All" 
                  count={companies.length}
                  isActive={!filterIndustry}
                  onClick={() => setFilterIndustry("")}
                />
                {industries.slice(0, 5).map((industry, index) => {
                  const count = companies.filter(c => c.industry === industry).length;
                  return (
                    <IndustryFilterBadge
                      key={index}
                      industry={industry}
                      count={count}
                      isActive={filterIndustry === industry}
                      onClick={(ind) => setFilterIndustry(ind === filterIndustry ? "" : ind)}
                    />
                  );
                })}
              </div>
            )}

            {filteredCompanies.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIllustration}>
                  <div style={styles.emptyIcon}>🏢</div>
                  <div style={styles.emptyTextContent}>
                    <h3 style={styles.emptyTitle}>No Companies Found</h3>
                    <p style={styles.emptyMessage}>
                      {searchTerm || filterIndustry 
                        ? "Try adjusting your search or filter criteria."
                        : "No companies have been registered yet."}
                    </p>
                    {(searchTerm || filterIndustry) && (
                      <button 
                        style={styles.clearSearchButton}
                        onClick={() => {
                          setSearchTerm("");
                          setFilterIndustry("");
                        }}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.companiesGrid}>
                {filteredCompanies.map((company) => (
                  <div key={company.id} style={styles.companyCard}>
                    {/* Company Header */}
                    <div style={styles.companyHeader}>
                      <div style={styles.companyLogoSection}>
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            style={styles.companyLogo}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                       
                      </div>
                      
                      <div style={styles.companyTitleSection}>
                        <h3 style={styles.companyName}>{company.name}</h3>
                        {company.industry && (
                          <span style={styles.industryTag}>{company.industry}</span>
                        )}
                      </div>
                    </div>

                    {/* Company Details */}
                    <div style={styles.companyDetails}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailIcon}>📍</span>
                        <span style={styles.detailText}>
                          {company.headquarters || "Location not specified"}
                        </span>
                      </div>
                      
                      <div style={styles.detailItem}>
                        <span style={styles.detailIcon}>👥</span>
                        <span style={styles.detailText}>
                          {company.companySize || "Size not specified"}
                        </span>
                      </div>
                      
                      <div style={styles.detailItem}>
                        <span style={styles.detailIcon}>📅</span>
                        <span style={styles.detailText}>
                          Founded: {company.foundedYear || "N/A"}
                        </span>
                      </div>
                      
                      {company.website && (
                        <div style={styles.detailItem}>
                          <span style={styles.detailIcon}>🌐</span>
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={styles.websiteLink}
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>

                    {/* About Company */}
                    {company.about && (
                      <div style={styles.aboutSection}>
                        <div style={styles.aboutHeader}>
                          <span style={styles.aboutIcon}>📝</span>
                          <span style={styles.aboutTitle}>About</span>
                        </div>
                        <p style={styles.aboutText}>
                          {company.about.length > 120 
                            ? `${company.about.substring(0, 120)}...` 
                            : company.about}
                        </p>
                      </div>
                    )}

                    {/* Footer with Action Button */}
                    <div style={styles.cardFooter}>
                      <div style={styles.footerLeft}>
                        <span style={styles.createdDate}>
                          Added {formatDate(company.createdAt)}
                        </span>
                      </div>
                      <div style={styles.footerRight}>
                        <button 
                          style={styles.reviewsButton}
                          onClick={() => navigate(`/ShowReviews/${company.id}`)}
                        >
                          <span style={styles.buttonIcon}>⭐</span>
                          View Reviews
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// CSS-in-JS styles with Indeed-like design
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  header: {
    backgroundColor: "#2557a7",
    background: "linear-gradient(135deg, #2557a7 0%, #1c4587 100%)",
    color: "white",
    padding: "40px 0 60px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "30px",
  },
  headerText: {
    flex: 1,
    minWidth: "300px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "18px",
    opacity: "0.9",
    marginBottom: "0",
    lineHeight: "1.5",
    maxWidth: "600px",
  },
  headerStats: {
    display: "flex",
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: "20px 30px",
    borderRadius: "8px",
    minWidth: "160px",
    backdropFilter: "blur(10px)",
    textAlign: "center",
  },
  statNumber: {
    display: "block",
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "14px",
    opacity: "0.9",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  controlsBar: {
    backgroundColor: "white",
    padding: "20px 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  controlsContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchBox: {
    flex: 1,
    minWidth: "300px",
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: "14px 45px 14px 20px",
    borderRadius: "8px",
    border: "2px solid #e1e5e9",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "all 0.3s",
    "&:focus": {
      outline: "none",
      borderColor: "#2557a7",
      boxShadow: "0 0 0 3px rgba(37, 87, 167, 0.1)",
    },
  },
  searchIcon: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "20px",
    color: "#666",
  },
  filterSelectContainer: {
    minWidth: "200px",
  },
  filterSelect: {
    width: "100%",
    padding: "14px 20px",
    borderRadius: "8px",
    border: "2px solid #e1e5e9",
    fontSize: "16px",
    backgroundColor: "white",
    cursor: "pointer",
    transition: "border-color 0.3s",
    "&:focus": {
      outline: "none",
      borderColor: "#2557a7",
    },
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px 40px",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "80px 20px",
  },
  spinnerContainer: {
    marginBottom: "20px",
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #2557a7",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  loadingText: {
    fontSize: "16px",
    color: "#666",
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "60px 40px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  },
  errorContent: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  errorIcon: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  errorTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px",
  },
  errorMessage: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
    lineHeight: "1.5",
  },
  retryButton: {
    backgroundColor: "#2557a7",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#1a4780",
    },
  },
  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e1e5e9",
    flexWrap: "wrap",
    gap: "15px",
  },
  resultsTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
    margin: "0",
  },
  resultsInfo: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },
  searchInfo: {
    fontSize: "14px",
    color: "#2557a7",
    backgroundColor: "#e8f0fe",
    padding: "6px 12px",
    borderRadius: "4px",
  },
  filterInfo: {
    fontSize: "14px",
    color: "#2e7d32",
    backgroundColor: "#e8f5e9",
    padding: "6px 12px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  clearFilter: {
    background: "none",
    border: "none",
    color: "#2e7d32",
    cursor: "pointer",
    fontSize: "12px",
    padding: "0",
    "&:hover": {
      opacity: "0.8",
    },
  },
  industryFilters: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500",
  },
  filterBadge: {
    backgroundColor: "#f0f0f0",
    color: "#666",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  activeFilterBadge: {
    backgroundColor: "#2557a7",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
  },
  filterCount: {
    fontSize: "12px",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "2px 6px",
    borderRadius: "10px",
    marginLeft: "2px",
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "60px 40px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  emptyIllustration: {
    maxWidth: "400px",
    margin: "0 auto",
  },
  emptyIcon: {
    fontSize: "80px",
    marginBottom: "20px",
    opacity: "0.5",
  },
  emptyTextContent: {
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px",
  },
  emptyMessage: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
    lineHeight: "1.5",
  },
  clearSearchButton: {
    backgroundColor: "#2557a7",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#1a4780",
    },
  },
  companiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "24px",
  },
  companyCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e1e5e9",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
      borderColor: "#2557a7",
    },
  },
  companyHeader: {
    padding: "24px 24px 16px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #e1e5e9",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
  },
  companyLogoSection: {
    flexShrink: "0",
    width: "60px",
    height: "60px",
    position: "relative",
  },
  companyLogo: {
    width: "100%",
    height: "100%",
    borderRadius: "6px",
    objectFit: "contain",
    backgroundColor: "white",
    border: "1px solid #e1e5e9",
    padding: "4px",
  },
  logoFallback: {
    width: "100%",
    height: "100%",
    borderRadius: "6px",
    backgroundColor: "#2557a7",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
  },
  companyTitleSection: {
    flex: "1",
  },
  companyName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2557a7",
    margin: "0 0 8px 0",
    lineHeight: "1.3",
  },
  industryTag: {
    backgroundColor: "#e8f0fe",
    color: "#2557a7",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  companyDetails: {
    padding: "20px 24px",
    flex: "1",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
    fontSize: "14px",
  },
  detailIcon: {
    fontSize: "16px",
    color: "#666",
    minWidth: "20px",
  },
  detailText: {
    color: "#333",
    fontWeight: "500",
  },
  websiteLink: {
    color: "#2557a7",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  aboutSection: {
    padding: "16px 24px",
    borderTop: "1px solid #e1e5e9",
    backgroundColor: "#fafafa",
  },
  aboutHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  aboutIcon: {
    fontSize: "16px",
    color: "#666",
  },
  aboutTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  aboutText: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5",
    margin: "0",
  },
  cardFooter: {
    padding: "16px 24px",
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #e1e5e9",
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flex: "1",
  },
  createdDate: {
    fontSize: "12px",
    color: "#888",
    fontStyle: "italic",
  },
  footerRight: {
    flexShrink: "0",
  },
  reviewsButton: {
    backgroundColor: "#2557a7",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#1a4780",
    },
  },
  buttonIcon: {
    fontSize: "16px",
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

export default CompanyReview;