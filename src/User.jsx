import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const User = () => {
  const [data, setdata] = useState([]);
  const [datas, setdas] = useState([]);
  const [search, setsearch] = useState("");
  const [dvisible, setdvisible] = useState(true);
  const [loc, setloc] = useState("");
  const [sal, setsal] = useState("");
 const [com,setcom]=useState("");
  const navigate = useNavigate();
  
  const GetJobs = async () => {
    try {
      await axios.get("https://localhost:7080/api/UserJobs").then((res) => {
        setdata(res.data);
      });
    } catch (err) {
      console.log("Data not found", err.message);
    }
  };

  const HandleChange = (e) => {
    const p = e.target.value;
    setsearch(p);
    SearchJobs(p);
  };
   

  const HandleChange2 = (e) => {
    const l = e.target.value;
    setloc(l);
    SearchLoc(l);
  };
  
  const HandleChange3 = (e) => {
    const t = e.target.value;
    setsal(t);
    SearchSal(t);
  };

    const HandleChange4= (e) => {
    const o = e.target.value;
   setcom(o);
    SearchCom(o);
  };
  
  const SearchCom=(o)=>{
    const kdata=data.filter(k=>k.company.toLowerCase().includes(o.toLowerCase()));
    setdas(kdata);
    setdvisible(false);
  }
  
  const SearchJobs = (p) => {
const kdata = data.filter((k) =>k.title.toLowerCase().includes(p.toLowerCase()));

    setdas(kdata);
  
    setdvisible(false);
  };
  
  const SearchSal = (t) => {
    const kdata = data.filter((k) => k.salary >= Number(t));
    setdas(kdata);
    setdvisible(false);
  };
  
  const SearchLoc = (l) => {
    const kdata = data.filter((k) =>
      k.location.toLowerCase().includes(l.toLowerCase())
    );
    setdas(kdata);
    setdvisible(false);
  };
  

  const clearFilters = () => {
    setsearch("");
    setloc("");
    setsal("");
    setdvisible(true);
  };

  useEffect(() => {
    GetJobs();
  }, []);

  return (
    <div style={page}>
      {/* Header */}
      <div style={headerContainer}>
        <h1 style={heading}>Find your next job</h1>
        <p style={subHeading}>Search jobs, companies, and locations</p>
      </div>

      {/* Search and Filter Section */}
      <div style={searchContainer}>
        <div style={searchBox}>
          <div style={searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <input
            type="text"
            name="search"
            value={search}
            onChange={HandleChange}
            placeholder="Search By Job title"
            style={searchInput}
          />
        </div>

      

         <div style={searchBox}>
          <div style={searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <input
            type="text"
            name="com"
            value={com}
            onChange={HandleChange4}
            placeholder="Search By Company Name"
            style={searchInput}
          />
        </div>


        <div style={filtersContainer}>
          <div style={filterGroup}>
            <span style={filterLabel}>Location</span>
            <select value={loc} onChange={HandleChange2} style={filterSelect}>
              <option value="">All locations</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Banglore">Banglore</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>

          <div style={filterGroup}>
            <span style={filterLabel}>Minimum Salary</span>
            <select value={sal} onChange={HandleChange3} style={filterSelect}>
              <option value="">Any salary</option>
              <option value="20000">₹20,000+</option>
              <option value="50000">₹50,000+</option>
              <option value="60000">₹60,000+</option>
              <option value="70000">₹70,000+</option>
              <option value="80000">₹80,000+</option>
              <option value="90000">₹90,000+</option>
              <option value="100000">₹1,00,000+</option>
            </select>
          </div>

          <button onClick={clearFilters} style={clearButton}>
            Clear filters
          </button>
        </div>

        <div style={resultsInfo}>
          {dvisible ? (
            <span>Showing all jobs ({data.length} found)</span>
          ) : (
            <span>Showing {datas.length} search results</span>
          )}
        </div>
      </div>

      {/* Job Listings */}
      <div style={jobsContainer}>
        <button onClick={()=>navigate("/CompanyReview")}>Get Company Reviews</button>
        {(dvisible ? data : datas).map((e, index) => (
          <div key={index} style={card}>
            <div style={cardHeader}>
              <div style={companyLogoContainer}>
                <img src={e.companyLogo} alt="logo" style={logo} />
              </div>
              <div style={jobInfo}>
                <h2 style={jobTitle}>{e.title}</h2>
                <div style={companyInfo}>
                  <span style={companyName}>{e.company}</span>
                  <span style={separator}>•</span>
                  <span style={location}>{e.location}</span>
                </div>
                <div style={jobDescription}>
                  {e.description.length > 150
                    ? `${e.description.substring(0, 100000)}`
                    : e.description}
                </div>
              </div>
            </div>

            <div style={cardFooter}>
              <div style={salaryContainer}>
                <span style={salaryLabel}>Estimated salary:</span>
                <span style={salary}>₹{e.salary.toLocaleString()}/month</span>
              </div>
              <div style={actionContainer}>
                <div style={jobIdContainer}>
                  <span style={jobIdLabel}>Job ID:</span>
                  <span style={jobId}>{e.id}</span>
                </div>
                <button
                  onClick={() => navigate(`/Apply/${e.id}`)}
                  style={applyButton}
                >
                  Apply Now
                </button>
                   
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!dvisible && datas.length === 0 && (
        <div style={emptyState}>
          <div style={emptyStateIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="#ccc">
              <path d="M11 15h2v2h-2zM11 7h2v6h-2z" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
          <h3 style={emptyStateTitle}>No jobs found</h3>
          <p style={emptyStateText}>
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button onClick={clearFilters} style={emptyStateButton}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

/* ===== Indeed-like Styles ===== */
const page = {
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
  fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  padding: "0",
};

const headerContainer = {
  backgroundColor: "#2557a7",
  padding: "32px 24px",
  color: "white",
};

const heading = {
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 0 8px 0",
  color: "white",
};

const subHeading = {
  fontSize: "16px",
  fontWeight: "400",
  margin: "0",
  opacity: "0.9",
};

const searchContainer = {
  backgroundColor: "white",
  padding: "24px",
  margin: "0 24px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  position: "relative",
  top: "-20px",
  marginBottom: "20px",
};

const searchBox = {
  position: "relative",
  marginBottom: "20px",
};

const searchIcon = {
  position: "absolute",
  left: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: "1",
};

const searchInput = {
  width: "100%",
  padding: "16px 16px 16px 48px",
  fontSize: "16px",
  border: "2px solid #e4e4e4",
  borderRadius: "8px",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const filtersContainer = {
  display: "flex",
  gap: "16px",
  alignItems: "flex-end",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const filterGroup = {
  flex: "1",
  minWidth: "200px",
};

const filterLabel = {
  display: "block",
  fontSize: "14px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "8px",
};

const filterSelect = {
  width: "100%",
  padding: "12px",
  fontSize: "14px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  backgroundColor: "white",
  outline: "none",
  cursor: "pointer",
};

const clearButton = {
  padding: "10px 20px",
  backgroundColor: "transparent",
  color: "#2557a7",
  border: "1px solid #2557a7",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
};

const resultsInfo = {
  fontSize: "14px",
  color: "#666",
  paddingTop: "16px",
  borderTop: "1px solid #eee",
};

const jobsContainer = {
  padding: "0 24px 40px",
};

const card = {
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "16px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  border: "1px solid #e0e0e0",
  transition: "box-shadow 0.2s",
};

const cardHeader = {
  display: "flex",
  gap: "16px",
  marginBottom: "20px",
};

const companyLogoContainer = {
  flexShrink: "0",
};

const logo = {
  width: "60px",
  height: "60px",
  objectFit: "contain",
  borderRadius: "4px",
  border: "1px solid #f0f0f0",
};

const jobInfo = {
  flex: "1",
};

const jobTitle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#2557a7",
  margin: "0 0 8px 0",
  lineHeight: "1.4",
};

const companyInfo = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "12px",
  fontSize: "14px",
};

const companyName = {
  fontWeight: "600",
  color: "#333",
};

const separator = {
  color: "#999",
  fontSize: "12px",
};

const location = {
  color: "#666",
};

const jobDescription = {
  fontSize: "14px",
  color: "#555",
  lineHeight: "1.6",
};

const cardFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "16px",
  paddingTop: "20px",
  borderTop: "1px solid #eee",
};

const salaryContainer = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const salaryLabel = {
  fontSize: "14px",
  color: "#666",
};

const salary = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#2e7d32",
};

const actionContainer = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
};

const jobIdContainer = {
  fontSize: "12px",
  color: "#999",
};

const jobIdLabel = {
  marginRight: "4px",
};

const jobId = {
  fontWeight: "600",
  color: "#666",
};

const applyButton = {
  padding: "12px 32px",
  backgroundColor: "#2557a7",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.2s",
  whiteSpace: "nowrap",
};

const emptyState = {
  textAlign: "center",
  padding: "60px 24px",
  backgroundColor: "white",
  borderRadius: "8px",
  margin: "24px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const emptyStateIcon = {
  marginBottom: "24px",
  opacity: "0.5",
};

const emptyStateTitle = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#333",
  margin: "0 0 12px 0",
};

const emptyStateText = {
  fontSize: "16px",
  color: "#666",
  margin: "0 0 24px 0",
  maxWidth: "400px",
  marginLeft: "auto",
  marginRight: "auto",
};

const emptyStateButton = {
  padding: "12px 32px",
  backgroundColor: "#2557a7",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

export default User;




