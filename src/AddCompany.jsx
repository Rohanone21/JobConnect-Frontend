import React, { useEffect, useState } from "react";
import axios from "axios";

const AddCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("form"); // 'form' or 'list'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        name,
        logoUrl,
        industry,
        companySize,
        headquarters,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        website,
        about
      };

      const res = await axios.post("https://localhost:7163/api/Companies", payload);
      
      // Add new company to the list
      setCompanies([...companies, res.data]);
      
      // Reset form
      setName("");
      setLogoUrl("");
      setIndustry("");
      setCompanySize("");
      setHeadquarters("");
      setFoundedYear("");
      setWebsite("");
      setAbout("");
      
      setSuccessMessage("Company added successfully!");
      setActiveTab("list"); // Switch to list view
    } catch (err) {
      console.log("Data could not be added", err.message);
      setErrorMessage(err.response?.data || "Failed to add company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GetCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://localhost:7163/api/Companies");
      setCompanies(res.data);
    } catch (err) {
      console.log("Data not found", err.message);
      setErrorMessage("Failed to load companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCompanies();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Company Directory</h1>
        <p style={styles.subtitle}>Manage and showcase your company profile</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div style={styles.successAlert}>
          <span style={styles.alertIcon}>✓</span>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div style={styles.errorAlert}>
          <span style={styles.alertIcon}>✗</span>
          {errorMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        <button
          style={activeTab === "form" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("form")}
        >
          Add New Company
        </button>
        <button
          style={activeTab === "list" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("list")}
        >
          View Companies ({companies.length})
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {activeTab === "form" ? (
          <div style={styles.formSection}>
            <div style={styles.formCard}>
              <div style={styles.formHeader}>
                <h2 style={styles.formTitle}>Company Information</h2>
                <p style={styles.formSubtitle}>Fill in your company details</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                  {/* Left Column */}
                  <div style={styles.formColumn}>
                    {/* Company Name */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="name">
                        Company Name *
                      </label>
                      <input
                        style={styles.input}
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    {/* Logo URL */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="logoUrl">
                        Logo URL
                      </label>
                      <input
                        style={styles.input}
                        type="url"
                        id="logoUrl"
                        name="logoUrl"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                      />
                      {logoUrl && (
                        <div style={styles.logoPreview}>
                          <img
                            src={logoUrl}
                            alt="Logo preview"
                            style={styles.previewImage}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Industry */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="industry">
                        Industry *
                      </label>
                      <select
                        style={styles.input}
                        id="industry"
                        name="industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                      >
                        <option value="">Select industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Company Size */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="companySize">
                        Company Size
                      </label>
                      <select
                        style={styles.input}
                        id="companySize"
                        name="companySize"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={styles.formColumn}>
                    {/* Headquarters */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="headquarters">
                        Headquarters *
                      </label>
                      <input
                        style={styles.input}
                        type="text"
                        id="headquarters"
                        name="headquarters"
                        value={headquarters}
                        onChange={(e) => setHeadquarters(e.target.value)}
                        placeholder="City, State, Country"
                        required
                      />
                    </div>

                    {/* Founded Year */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="foundedYear">
                        Founded Year
                      </label>
                      <input
                        style={styles.input}
                        type="number"
                        id="foundedYear"
                        name="foundedYear"
                        value={foundedYear}
                        onChange={(e) => setFoundedYear(e.target.value)}
                        placeholder="YYYY"
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    </div>

                    {/* Website */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="website">
                        Website *
                      </label>
                      <input
                        style={styles.input}
                        type="url"
                        id="website"
                        name="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* About Company - Full width */}
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="about">
                    About Company *
                  </label>
                  <textarea
                    style={styles.textarea}
                    id="about"
                    name="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Describe your company, culture, mission, and values..."
                    rows="4"
                    required
                  />
                  <div style={styles.charCount}>
                    {about.length}/500 characters
                  </div>
                </div>

                {/* Submit Button */}
                <div style={styles.buttonContainer}>
                  <button 
                    type="submit" 
                    style={loading ? styles.submitButtonDisabled : styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span style={styles.spinner}></span>
                        Adding Company...
                      </>
                    ) : (
                      "Add Company"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Card */}
            {name && (
              <div style={styles.previewCard}>
                <h3 style={styles.previewTitle}>Preview</h3>
                <div style={styles.previewContent}>
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt="Company logo"
                      style={styles.previewLogo}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div style={styles.previewDetails}>
                    <h4 style={styles.previewCompanyName}>{name}</h4>
                    <div style={styles.previewMeta}>
                      {industry && <span style={styles.previewBadge}>{industry}</span>}
                      {companySize && <span style={styles.previewBadge}>{companySize} employees</span>}
                      {headquarters && <span style={styles.previewBadge}>{headquarters}</span>}
                    </div>
                    {about && (
                      <p style={styles.previewAbout}>
                        {about.length > 150 ? about.substring(0, 150) + "..." : about}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Companies List View
          <div style={styles.listSection}>
            <div style={styles.listHeader}>
              <h2 style={styles.listTitle}>Registered Companies</h2>
              <div style={styles.stats}>
                <span style={styles.statItem}>
                  <strong>{companies.length}</strong> Total Companies
                </span>
              </div>
            </div>

            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinnerLarge}></div>
                <p>Loading companies...</p>
              </div>
            ) : companies.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🏢</div>
                <h3>No Companies Found</h3>
                <p>Add your first company to get started!</p>
                <button 
                  style={styles.addFirstButton}
                  onClick={() => setActiveTab("form")}
                >
                  Add Company
                </button>
              </div>
            ) : (
              <div style={styles.companiesGrid}>
                {companies.map((company) => (
                  <div key={company.id} style={styles.companyCard}>
                    <div style={styles.cardHeader}>
                      {company.logoUrl && (
                        <img
                          src={company.logoUrl}
                          alt={`${company.name} logo`}
                          style={styles.companyLogo}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <h3 style={styles.companyName}>{company.name}</h3>
                        <p style={styles.companyIndustry}>{company.industry}</p>
                      </div>
                    </div>
                    
                    <div style={styles.cardBody}>
                      <div style={styles.companyInfo}>
                        <div style={styles.infoRow}>
                          <span style={styles.infoLabel}>Size:</span>
                          <span>{company.companySize || "N/A"}</span>
                        </div>
                        <div style={styles.infoRow}>
                          <span style={styles.infoLabel}>Location:</span>
                          <span>{company.headquarters || "N/A"}</span>
                        </div>
                        <div style={styles.infoRow}>
                          <span style={styles.infoLabel}>Founded:</span>
                          <span>{company.foundedYear || "N/A"}</span>
                        </div>
                        <div style={styles.infoRow}>
                          <span style={styles.infoLabel}>Website:</span>
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={styles.websiteLink}
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                      
                      {company.about && (
                        <div style={styles.companyAbout}>
                          <p style={styles.aboutText}>
                            {company.about.length > 100 
                              ? company.about.substring(0, 100) + "..." 
                              : company.about}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div style={styles.cardFooter}>
                      <span style={styles.createdDate}>
                        Added: {formatDate(company.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    padding: "20px 0",
  },
  mainTitle: {
    color: "#0a66c2", // LinkedIn blue
    fontSize: "36px",
    marginBottom: "8px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #0a66c2, #004182)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#666",
    fontSize: "18px",
    marginTop: "0",
    fontWeight: "400",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "10px",
  },
  tab: {
    padding: "12px 24px",
    margin: "0 10px",
    border: "none",
    background: "none",
    fontSize: "16px",
    fontWeight: "500",
    color: "#666",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  },
  activeTab: {
    padding: "12px 24px",
    margin: "0 10px",
    border: "none",
    background: "#0a66c2",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(10, 102, 194, 0.3)",
    transition: "all 0.3s ease",
  },
  content: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  formSection: {
    padding: "30px",
  },
  formCard: {
    backgroundColor: "white",
  },
  formHeader: {
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#666",
    marginTop: "0",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    marginBottom: "30px",
  },
  formColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#333",
    display: "flex",
    alignItems: "center",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    width: "100%",
    boxSizing: "border-box",
    "&:focus": {
      outline: "none",
      borderColor: "#0a66c2",
      boxShadow: "0 0 0 3px rgba(10, 102, 194, 0.1)",
    },
  },
  textarea: {
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "120px",
    fontFamily: "inherit",
    "&:focus": {
      outline: "none",
      borderColor: "#0a66c2",
      boxShadow: "0 0 0 3px rgba(10, 102, 194, 0.1)",
    },
  },
  charCount: {
    fontSize: "12px",
    color: "#666",
    textAlign: "right",
    marginTop: "4px",
  },
  logoPreview: {
    marginTop: "10px",
    textAlign: "center",
  },
  previewImage: {
    maxWidth: "100px",
    maxHeight: "60px",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
  },
  buttonContainer: {
    textAlign: "center",
    paddingTop: "30px",
    borderTop: "1px solid #e0e0e0",
  },
  submitButton: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "16px 40px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    minWidth: "200px",
    "&:hover": {
      backgroundColor: "#004182",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(10, 102, 194, 0.3)",
    },
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    color: "#666",
    border: "none",
    padding: "16px 40px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    minWidth: "200px",
  },
  spinner: {
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: "50%",
    borderTop: "2px solid white",
    width: "16px",
    height: "16px",
    animation: "spin 1s linear infinite",
  },
  spinnerLarge: {
    border: "4px solid rgba(10, 102, 194, 0.1)",
    borderRadius: "50%",
    borderTop: "4px solid #0a66c2",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  successAlert: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "16px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #c3e6cb",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  errorAlert: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "16px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  alertIcon: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  previewCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "25px",
    marginTop: "30px",
    border: "1px solid #e0e0e0",
  },
  previewTitle: {
    color: "#333",
    fontSize: "20px",
    marginBottom: "20px",
    fontWeight: "600",
  },
  previewContent: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },
  previewLogo: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "contain",
    border: "1px solid #e0e0e0",
    backgroundColor: "white",
    padding: "10px",
  },
  previewDetails: {
    flex: 1,
  },
  previewCompanyName: {
    color: "#0a66c2",
    fontSize: "22px",
    margin: "0 0 10px 0",
    fontWeight: "600",
  },
  previewMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "15px",
  },
  previewBadge: {
    backgroundColor: "#e8f4fe",
    color: "#0a66c2",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
  previewAbout: {
    color: "#555",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0",
  },
  listSection: {
    padding: "30px",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  listTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    margin: "0",
  },
  stats: {
    display: "flex",
    gap: "20px",
  },
  statItem: {
    fontSize: "14px",
    color: "#666",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  addFirstButton: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "20px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#004182",
    },
  },
  companiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "25px",
  },
  companyCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    },
  },
  cardHeader: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  companyLogo: {
    width: "50px",
    height: "50px",
    borderRadius: "6px",
    objectFit: "contain",
    backgroundColor: "white",
    padding: "5px",
    border: "1px solid #e0e0e0",
  },
  companyName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 4px 0",
  },
  companyIndustry: {
    fontSize: "14px",
    color: "#0a66c2",
    fontWeight: "500",
    margin: "0",
  },
  cardBody: {
    padding: "20px",
  },
  companyInfo: {
    marginBottom: "20px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#666",
  },
  websiteLink: {
    color: "#0a66c2",
    textDecoration: "none",
    fontWeight: "500",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  companyAbout: {
    paddingTop: "15px",
    borderTop: "1px solid #e0e0e0",
  },
  aboutText: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5",
    margin: "0",
  },
  cardFooter: {
    padding: "15px 20px",
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #e0e0e0",
    fontSize: "12px",
    color: "#666",
  },
  createdDate: {
    fontSize: "12px",
    color: "#888",
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

export default AddCompany;