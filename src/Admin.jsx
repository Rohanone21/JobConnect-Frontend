import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState([]);
  const [title, settitle] = useState("");
  const [company, setcompany] = useState("");
  const [companyLogo, setcompanyLogo] = useState("");
  const [description, setdescription] = useState("");
  const [location, setlocation] = useState("");
  const [salary, setsalary] = useState("");
  const [visible, setvisible] = useState(false);
  const [Bcount, setBcount] = useState(0);
  const [Id, setId] = useState("");
  const [datas, setdatas] = useState([]);
  const [dvisible, setdvisible] = useState(true);
  const [kvisible, setkvisible] = useState(false);

  const GetJobs = async () => {
    try {
      const res = await axios.get("https://localhost:7077/api/AdminJobs");
      setdata(res.data);
    } catch (err) {
      console.log("Data not found", err.message);
    }
  };

  const AddJobs = async () => {
    try {
      const payload = { title, company, companyLogo, description, location, salary };
      const res = await axios.post("https://localhost:7077/api/AdminJobs", payload);
      setdata([...data, res.data]);
      settitle("");
      setcompany("");
      setcompanyLogo("");
      setdescription("");
      setlocation("");
      setsalary("");
      setvisible(false);
    } catch (err) {
      console.log("Data not Added", err.message);
    }
  };

  const HandleChange = (e) => {
    const k = e.target.value;
    setId(k);
    SearchById(k);
  };

  const SearchById = async (Id) => {
    try {
      const res = await axios.get(`https://localhost:7077/api/AdminJobs/${Id}`);
      if (Id.length > 0) {
        setdatas(res.data);
        setdvisible(false);
        setkvisible(true);
      } else {
        setdatas([]);
        setdvisible(true);
        setkvisible(false);
      }
    } catch (err) {
      console.log("Data not found", err.message);
    }
  };

  const DeleteJobs = async (Id) => {
    try {
      await axios.delete(`https://localhost:7077/api/AdminJobs/${Id}`);
      setdata((prev) => prev.filter((k) => k.id !== Id));
      setdatas([]);
    } catch (err) {
      console.log("Failed to delete", err.message);
    }
  };

  const AddButton = () => {
    if (Bcount % 2 === 0) {
      setvisible(true);
      setBcount(Bcount + 1);
    } else {
      setvisible(false);
      AddJobs();
      setBcount(Bcount + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AddJobs();
  };

  useEffect(() => {
    GetJobs();
  }, []);

  return (
    <div style={styles.page}>
      {/* Top Header Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarContent}>
          <div style={styles.topBarLeft}>
            <h1 style={styles.heading}>Admin Dashboard</h1>
          </div>
          <div style={styles.topBarRight}>
            <button
              onClick={() => navigate("/AddCompany")}
              style={styles.globalBtn}
            >
              <span style={styles.globalIcon}>🌍</span>
              Make Company Global
              <span style={styles.badge}>{data.length || 0}</span>
            </button>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Controls Section */}
        <div style={styles.controlsCard}>
          <div style={styles.controlsHeader}>
            <h2 style={styles.controlsTitle}>Job Management</h2>
            <p style={styles.controlsSubtitle}>Add, search, and manage job postings</p>
          </div>

          <div style={styles.controlsRow}>
            <button style={styles.primaryBtn} onClick={() => AddButton()}>
              <span style={styles.btnIcon}>+</span>
              {visible ? "Cancel" : "Add New Job"}
            </button>

            <div style={styles.searchContainer}>
              <div style={styles.searchBox}>
                <input
                  style={styles.searchInput}
                  type="number"
                  placeholder="Search by Job ID"
                  value={Id}
                  onChange={HandleChange}
                />
                <button style={styles.searchBtn} onClick={() => SearchById(Id)}>
                  <span style={styles.searchIcon}>🔍</span>
                  Search
                </button>
              </div>
              <div style={styles.stats}>
                <span style={styles.statItem}>
                  <strong>{data.length}</strong> Total Jobs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Job Form */}
        {visible && (
          <div style={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Job Title *</label>
                  <input
                    style={styles.input}
                    placeholder="Senior Software Engineer"
                    value={title}
                    onChange={(e) => settitle(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Company Name *</label>
                  <input
                    style={styles.input}
                    placeholder="Google, Microsoft, etc."
                    value={company}
                    onChange={(e) => setcompany(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Company Logo URL</label>
                  <input
                    style={styles.input}
                    placeholder="https://example.com/logo.png"
                    value={companyLogo}
                    onChange={(e) => setcompanyLogo(e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Location *</label>
                  <input
                    style={styles.input}
                    placeholder="Remote, New York, etc."
                    value={location}
                    onChange={(e) => setlocation(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Salary *</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Annual salary in USD"
                    value={salary}
                    onChange={(e) => setsalary(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Job Description *</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Enter detailed job description, requirements, and benefits..."
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                  rows="4"
                  required
                />
              </div>

              <div style={styles.formActions}>
                <button type="submit" style={styles.submitBtn}>
                  Publish Job
                </button>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setvisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Result */}
        {kvisible && datas && (
          <div style={styles.singleResultCard}>
            <div style={styles.resultHeader}>
              <h3 style={styles.resultTitle}>Search Result</h3>
              <button
                style={styles.clearSearchBtn}
                onClick={() => {
                  setId("");
                  setkvisible(false);
                  setdvisible(true);
                }}
              >
                Clear Search
              </button>
            </div>
            <div style={styles.resultCard}>
              <div style={styles.cardHeader}>
                {datas.companyLogo && (
                  <img src={datas.companyLogo} alt="logo" style={styles.logo} />
                )}
                <div style={styles.cardHeaderContent}>
                  <h2 style={styles.jobTitle}>{datas.title}</h2>
                  <p style={styles.companyText}>
                    {datas.company} · {datas.location}
                  </p>
                  <div style={styles.metaInfo}>
                    <span style={styles.salaryText}>${datas.salary}/year</span>
                    <span style={styles.dateText}>
                      Posted: {new Date(datas.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p style={styles.desc}>{datas.description}</p>
              <div style={styles.cardActions}>
                <button
                  style={styles.showBtn}
                  onClick={() => navigate(`/Applicants/${datas.id}`)}
                >
                  Show Applications
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => DeleteJobs(datas.id)}
                >
                  Delete Job
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job List */}
        {dvisible && (
          <div style={styles.jobsSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>All Job Postings</h2>
              <div style={styles.filterBadge}>
                {data.length} {data.length === 1 ? "Job" : "Jobs"} Active
              </div>
            </div>

            {data.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <h3 style={styles.emptyTitle}>No Jobs Posted Yet</h3>
                <p style={styles.emptyText}>
                  Start by adding your first job posting
                </p>
                <button
                  style={styles.addFirstBtn}
                  onClick={() => {
                    setvisible(true);
                    setBcount(Bcount + 1);
                  }}
                >
                  + Add First Job
                </button>
              </div>
            ) : (
              <div style={styles.jobsGrid}>
                {data.map((job, index) => (
                  <div key={index} style={styles.jobCard}>
                    <div style={styles.cardHeader}>
                      {job.companyLogo && (
                        <img
                          src={job.companyLogo}
                          alt="logo"
                          style={styles.logo}
                        />
                      )}
                      <div style={styles.cardHeaderContent}>
                        <h2 style={styles.jobTitle}>{job.title}</h2>
                        <p style={styles.companyText}>
                          {job.company} · {job.location}
                        </p>
                        <div style={styles.metaInfo}>
                          <span style={styles.salaryText}>${job.salary}/year</span>
                          <span style={styles.dateText}>
                            {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p style={styles.desc}>
                      {job.description.length > 150
                        ? job.description.substring(0, 500) 
                        : job.description}
                    </p>

                    <div style={styles.cardActions}>
                      <button
                        style={styles.showBtn}
                        onClick={() => navigate(`/Applicants/${job.id}`)}
                      >
                        View Applications
                      </button>
                      
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
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  topBar: {
    backgroundColor: "#0a66c2",
    padding: "20px 0",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  },
  topBarContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBarLeft: {
    flex: 1,
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "white",
    margin: "0",
  },
  globalBtn: {
    backgroundColor: "white",
    color: "#0a66c2",
    padding: "12px 24px",
    border: "none",
    borderRadius: "30px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
    position: "relative",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    },
  },
  globalIcon: {
    fontSize: "20px",
  },
  badge: {
    backgroundColor: "#ff6b6b",
    color: "white",
    fontSize: "12px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "10px",
    marginLeft: "5px",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px",
  },
  controlsCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  controlsHeader: {
    marginBottom: "25px",
  },
  controlsTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 8px 0",
  },
  controlsSubtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
  },
  controlsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  primaryBtn: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#004182",
    },
  },
  btnIcon: {
    fontSize: "20px",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },
  searchBox: {
    display: "flex",
    gap: "10px",
  },
  searchInput: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    minWidth: "200px",
    "&:focus": {
      outline: "none",
      borderColor: "#0a66c2",
      boxShadow: "0 0 0 3px rgba(10, 102, 194, 0.1)",
    },
  },
  searchBtn: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "&:hover": {
      backgroundColor: "#218838",
    },
  },
  searchIcon: {
    fontSize: "14px",
  },
  stats: {
    display: "flex",
    gap: "15px",
  },
  statItem: {
    fontSize: "14px",
    color: "#666",
    backgroundColor: "#f8f9fa",
    padding: "8px 16px",
    borderRadius: "6px",
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
    "&:focus": {
      outline: "none",
      borderColor: "#0a66c2",
      boxShadow: "0 0 0 3px rgba(10, 102, 194, 0.1)",
    },
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    minHeight: "120px",
    resize: "vertical",
    boxSizing: "border-box",
    "&:focus": {
      outline: "none",
      borderColor: "#0a66c2",
      boxShadow: "0 0 0 3px rgba(10, 102, 194, 0.1)",
    },
  },
  formActions: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
  },
  submitBtn: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#218838",
    },
  },
  cancelBtn: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#5a6268",
    },
  },
  singleResultCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "30px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  resultTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    margin: "0",
  },
  clearSearchBtn: {
    backgroundColor: "transparent",
    color: "#666",
    border: "1px solid #ddd",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  },
  resultCard: {
    border: "2px solid #e3f2fd",
    borderRadius: "8px",
    padding: "20px",
  },
  jobsSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
    margin: "0",
  },
  filterBadge: {
    backgroundColor: "#e3f2fd",
    color: "#0a66c2",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
  },
  addFirstBtn: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#004182",
    },
  },
  jobsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "25px",
  },
  jobCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e0e0e0",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    },
  },
  cardHeader: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
  },
  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    objectFit: "contain",
    backgroundColor: "white",
    padding: "5px",
    border: "1px solid #e0e0e0",
  },
  cardHeaderContent: {
    flex: 1,
  },
  jobTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0a66c2",
    margin: "0 0 5px 0",
  },
  companyText: {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 10px 0",
  },
  metaInfo: {
    display: "flex",
    gap: "15px",
  },
  salaryText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#28a745",
  },
  dateText: {
    fontSize: "12px",
    color: "#888",
  },
  desc: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
  },
  showBtn: {
    flex: 1,
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#004182",
    },
  },

};

export default Admin;


