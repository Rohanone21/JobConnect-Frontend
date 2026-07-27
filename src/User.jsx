import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

// ==========================================
// 1. CHATBOT FLOATING WIDGET COMPONENT
// ==========================================
const ChatbotWidget = ({ email }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("chats")) || [
        {
          sender: "bot",
          text: "Hello! How can I help you find a job today?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]
    );
  });
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!question.trim() || loading) return;

    const userText = question.trim();
    const timeStamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, time: timeStamp },
    ]);
    setQuestion("");
    setLoading(true);

    try {
      const payload = {
        question: userText,
        applicationEmai: email,
      };

      const res = await axios.post("https://localhost:7077/api/AIChat", payload);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data?.answer || res.data || "No response received.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("Chatbot Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I couldn't process your request. Please check your backend connection.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div style={chatStyles.window}>
          <div style={chatStyles.header}>
            <div style={chatStyles.headerInfo}>
              <div style={chatStyles.avatar}>AI</div>
              <div>
                <h4 style={chatStyles.title}>Career Assistant</h4>
                <span style={chatStyles.status}>● Online</span>
              </div>
            </div>
            <button style={chatStyles.closeButton} onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div style={chatStyles.chatArea}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...chatStyles.messageWrapper,
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...chatStyles.bubble,
                    ...(msg.sender === "user" ? chatStyles.userBubble : chatStyles.botBubble),
                    ...(msg.isError ? chatStyles.errorBubble : {}),
                  }}
                >
                  <p style={chatStyles.messageText}>{msg.text}</p>
                  <span
                    style={{
                      ...chatStyles.timestamp,
                      color: msg.sender === "user" ? "rgba(255,255,255,0.75)" : "#8d99ae",
                    }}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ ...chatStyles.messageWrapper, justifyContent: "flex-start" }}>
                <div style={{ ...chatStyles.bubble, ...chatStyles.botBubble, ...chatStyles.loadingBubble }}>
                  <span style={chatStyles.dot}></span>
                  <span style={{ ...chatStyles.dot, animationDelay: "0.2s" }}></span>
                  <span style={{ ...chatStyles.dot, animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} style={chatStyles.inputForm}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about jobs, salaries..."
              style={chatStyles.input}
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              style={{
                ...chatStyles.sendButton,
                opacity: !question.trim() || loading ? 0.6 : 1,
                cursor: !question.trim() || loading ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button style={chatStyles.floatingButton} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Chat">
        {isOpen ? (
          "✕"
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
        )}
      </button>
    </>
  );
};

// ==========================================
// 2. MAIN USER PAGE COMPONENT
// ==========================================
const User = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // Single unified state for filters
  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
  });

  const navigate = useNavigate();

  const GetJobs = async () => {
    try {
      const res = await axios.get("https://localhost:7080/api/UserJobs");
      setData(res.data);
    } catch (err) {
      console.error("Data not found", err.message);
    }
  };

  useEffect(() => {
    GetJobs();
  }, []);

  // Combined Multi-Filter Handler
  const applyFilters = (updatedFilters) => {
    const { title, company, location, salary } = updatedFilters;

    const hasActiveFilter = Boolean(title || company || location || salary);
    setIsFiltered(hasActiveFilter);

    if (!hasActiveFilter) {
      setFilteredData([]);
      return;
    }

    const filtered = data.filter((item) => {
      const matchesTitle = item.title?.toLowerCase().includes(title.toLowerCase());
      const matchesCompany = item.company?.toLowerCase().includes(company.toLowerCase());
      const matchesLocation = location ? item.location?.toLowerCase().includes(location.toLowerCase()) : true;
      const matchesSalary = salary ? Number(item.salary) >= Number(salary) : true;

      return matchesTitle && matchesCompany && matchesLocation && matchesSalary;
    });

    setFilteredData(filtered);
  };

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const reset = { title: "", company: "", location: "", salary: "" };
    setFilters(reset);
    setIsFiltered(false);
    setFilteredData([]);
  };

  const displayJobs = isFiltered ? filteredData : data;

  return (
    <div style={page}>
      {/* Header */}
      <div style={headerContainer}>
        <div style={headerContent}>
          <div>
            <h1 style={heading}>Find your next career move</h1>
            <p style={subHeading}>Explore thousands of jobs, companies, and locations in one place</p>
          </div>
          <button style={reviewButton} onClick={() => navigate("/CompanyReview")}>
            Get Company Reviews
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div style={searchContainer}>
        <div style={searchRow}>
          <div style={searchBox}>
            <div style={searchIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#6c757d">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
            <input
              type="text"
              value={filters.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Search by Job title"
              style={searchInput}
            />
          </div>

          <div style={searchBox}>
            <div style={searchIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#6c757d">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
              </svg>
            </div>
            <input
              type="text"
              value={filters.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Search by Company Name"
              style={searchInput}
            />
          </div>
        </div>

        <div style={filtersContainer}>
          <div style={filterGroup}>
            <span style={filterLabel}>Location</span>
            <select
              value={filters.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              style={filterSelect}
            >
              <option value="">All locations</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Banglore">Banglore</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>

          <div style={filterGroup}>
            <span style={filterLabel}>Minimum Salary</span>
            <select
              value={filters.salary}
              onChange={(e) => handleInputChange("salary", e.target.value)}
              style={filterSelect}
            >
              <option value="">Any salary</option>
              <option value="20000">₹20,000+/month</option>
              <option value="50000">₹50,000+/month</option>
              <option value="60000">₹60,000+/month</option>
              <option value="70000">₹70,000+/month</option>
              <option value="80000">₹80,000+/month</option>
              <option value="90000">₹90,000+/month</option>
              <option value="100000">₹1,00,000+/month</option>
            </select>
          </div>

          <button onClick={clearFilters} style={clearButton}>
            Clear filters
          </button>
        </div>

        <div style={resultsInfo}>
          {!isFiltered ? (
            <span>Showing all jobs (<strong>{data.length}</strong> found)</span>
          ) : (
            <span>Showing <strong>{filteredData.length}</strong> search results</span>
          )}
        </div>
      </div>

      {/* Navigation Quick Actions */}
      <div style={quickActionsContainer}>
        <button onClick={() => navigate("/Recommendation")} style={secondaryActionButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Recommend Jobs
        </button>
        <button onClick={() => navigate("/Careeranalysis")} style={secondaryActionButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          Career Analysis
        </button>
      </div>

      {/* Job Listings */}
      <div style={jobsContainer}>
        {displayJobs.map((e, index) => (
          <div key={e.id || index} style={card}>
            <div style={cardHeader}>
              <div style={companyLogoContainer}>
                <img
                  src={e.companyLogo || "https://via.placeholder.com/64?text=Job"}
                  alt={`${e.company || "Company"} logo`}
                  style={logo}
                />
              </div>
              <div style={jobInfo}>
                <h2 style={jobTitle}>{e.title}</h2>
                <div style={companyInfo}>
                  <span style={companyName}>{e.company}</span>
                  <span style={separator}>•</span>
                  <span style={locationBadge}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#6c757d" style={{ marginRight: "4px" }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {e.location}
                  </span>
                </div>
                <div style={jobDescription}>
                  {e.description && e.description.length > 200
                    ? `${e.description.substring(0, 200)}...`
                    : e.description}
                </div>
              </div>
            </div>

            <div style={cardFooter}>
              <div style={salaryContainer}>
                <span style={salaryLabel}>Estimated salary:</span>
                <span style={salary}>₹{Number(e.salary).toLocaleString()}/mo</span>
              </div>
              <div style={actionContainer}>
                <div style={jobIdContainer}>
                  <span style={jobIdLabel}>Job ID:</span>
                  <span style={jobId}>#{e.id}</span>
                </div>
                <button onClick={() => navigate(`/Apply/${e.id}`)} style={applyButton}>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {isFiltered && filteredData.length === 0 && (
        <div style={emptyState}>
          <div style={emptyStateIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="#a0aec0">
              <path d="M11 15h2v2h-2zM11 7h2v6h-2z" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
          <h3 style={emptyStateTitle}>No matching jobs found</h3>
          <p style={emptyStateText}>
            We couldn't find any opportunities matching your filters. Try tweaking your search criteria.
          </p>
          <button onClick={clearFilters} style={emptyStateButton}>
            Clear all filters
          </button>
        </div>
      )}

      {/* Floating Chatbot Component */}
      <ChatbotWidget email="user@example.com" />
    </div>
  );
};

// ==========================================
// 3. MODERNIZED STYLES
// ==========================================

/* Floating Chatbot Styles */
const chatStyles = {
  floatingButton: {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#1e40af",
    color: "#fff",
    border: "none",
    boxShadow: "0 8px 24px rgba(30, 64, 175, 0.35)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    zIndex: 1000,
    transition: "transform 0.2s ease, background-color 0.2s ease",
  },
  window: {
    position: "fixed",
    bottom: "96px",
    right: "28px",
    width: "380px",
    height: "520px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1000,
    border: "1px solid #e2e8f0",
  },
  header: {
    padding: "16px 20px",
    backgroundColor: "#1e40af",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "0.5px",
  },
  title: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
  },
  status: {
    fontSize: "11px",
    color: "#93c5fd",
    fontWeight: "500",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px",
    lineHeight: 1,
  },
  chatArea: {
    flex: 1,
    padding: "18px",
    overflowY: "auto",
    backgroundColor: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageWrapper: {
    display: "flex",
    width: "100%",
  },
  bubble: {
    maxWidth: "82%",
    padding: "10px 14px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    wordBreak: "break-word",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  userBubble: {
    backgroundColor: "#1e40af",
    color: "#ffffff",
    borderBottomRightRadius: "4px",
  },
  botBubble: {
    backgroundColor: "#ffffff",
    color: "#1e293b",
    borderBottomLeftRadius: "4px",
    border: "1px solid #e2e8f0",
  },
  errorBubble: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },
  loadingBubble: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
    padding: "12px 16px",
  },
  dot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#94a3b8",
    borderRadius: "50%",
    display: "inline-block",
  },
  messageText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.5",
  },
  timestamp: {
    fontSize: "10px",
    alignSelf: "flex-end",
  },
  inputForm: {
    display: "flex",
    padding: "12px 16px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e2e8f0",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "20px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "13px",
    backgroundColor: "#f8fafc",
  },
  sendButton: {
    padding: "10px 18px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#1e40af",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "13px",
    transition: "background-color 0.2s ease",
  },
};

/* Modern Main Page Styles */
const page = {
  minHeight: "100vh",
  backgroundColor: "#f1f5f9",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  padding: "0 0 60px 0",
  position: "relative",
  color: "#0f172a",
};

const headerContainer = {
  backgroundColor: "#1e40af",
  padding: "48px 24px 64px 24px",
  color: "white",
  background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
};

const headerContent = {
  maxWidth: "1000px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px",
};

const heading = {
  fontSize: "32px",
  fontWeight: "800",
  margin: "0 0 8px 0",
  color: "#ffffff",
  letterSpacing: "-0.5px",
};

const subHeading = {
  fontSize: "16px",
  fontWeight: "400",
  margin: "0",
  color: "#bfdbfe",
};

const reviewButton = {
  padding: "12px 22px",
  backgroundColor: "#ffffff",
  color: "#1e40af",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
};

const searchContainer = {
  backgroundColor: "#ffffff",
  padding: "24px",
  maxWidth: "1000px",
  margin: "-36px auto 24px auto",
  borderRadius: "12px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
  position: "relative",
  zIndex: 10,
  border: "1px solid #e2e8f0",
};

const searchRow = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
};

const searchBox = {
  position: "relative",
  marginBottom: "16px",
  flex: "1",
  minWidth: "260px",
};

const searchIcon = {
  position: "absolute",
  left: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: "1",
  display: "flex",
  alignItems: "center",
};

const searchInput = {
  width: "100%",
  padding: "12px 16px 12px 48px",
  fontSize: "14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "#f8fafc",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
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
  minWidth: "180px",
};

const filterLabel = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#475569",
  marginBottom: "6px",
};

const filterSelect = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  backgroundColor: "#f8fafc",
  outline: "none",
  cursor: "pointer",
  color: "#1e293b",
};

const clearButton = {
  padding: "10px 20px",
  backgroundColor: "transparent",
  color: "#64748b",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  whiteSpace: "nowrap",
  height: "40px",
  transition: "all 0.2s ease",
};

const resultsInfo = {
  fontSize: "13px",
  color: "#64748b",
  paddingTop: "16px",
  borderTop: "1px solid #f1f5f9",
};

const quickActionsContainer = {
  maxWidth: "1000px",
  margin: "0 auto 20px auto",
  padding: "0 24px",
  display: "flex",
  gap: "12px",
};

const secondaryActionButton = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 18px",
  backgroundColor: "#ffffff",
  color: "#334155",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  transition: "all 0.2s ease",
};

const jobsContainer = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "0 24px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const card = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
  border: "1px solid #e2e8f0",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const cardHeader = {
  display: "flex",
  gap: "20px",
  marginBottom: "16px",
};

const companyLogoContainer = {
  flexShrink: "0",
};

const logo = {
  width: "64px",
  height: "64px",
  objectFit: "contain",
  borderRadius: "8px",
  border: "1px solid #f1f5f9",
  backgroundColor: "#f8fafc",
  padding: "4px",
};

const jobInfo = {
  flex: "1",
};

const jobTitle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e40af",
  margin: "0 0 6px 0",
  lineHeight: "1.3",
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
  color: "#334155",
};

const separator = {
  color: "#cbd5e1",
  fontSize: "12px",
};

const locationBadge = {
  color: "#64748b",
  display: "inline-flex",
  alignItems: "center",
};

const jobDescription = {
  fontSize: "14px",
  color: "#475569",
  lineHeight: "1.6",
};

const cardFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "16px",
  paddingTop: "16px",
  borderTop: "1px solid #f1f5f9",
};

const salaryContainer = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const salaryLabel = {
  fontSize: "13px",
  color: "#64748b",
};

const salary = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#15803d",
  backgroundColor: "#f0fdf4",
  padding: "4px 10px",
  borderRadius: "6px",
  border: "1px solid #dcfce7",
};

const actionContainer = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
};

const jobIdContainer = {
  fontSize: "12px",
  color: "#94a3b8",
};

const jobIdLabel = {
  marginRight: "4px",
};

const jobId = {
  fontWeight: "600",
  color: "#64748b",
};

const applyButton = {
  padding: "10px 24px",
  backgroundColor: "#1e40af",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  whiteSpace: "nowrap",
  boxShadow: "0 2px 4px rgba(30, 64, 175, 0.2)",
  transition: "all 0.2s ease",
};

const emptyState = {
  textAlign: "center",
  padding: "60px 24px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  maxWidth: "1000px",
  margin: "24px auto",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  border: "1px solid #e2e8f0",
};

const emptyStateIcon = {
  marginBottom: "16px",
  opacity: "0.8",
};

const emptyStateTitle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0 0 8px 0",
};

const emptyStateText = {
  fontSize: "14px",
  color: "#64748b",
  margin: "0 0 20px 0",
  maxWidth: "400px",
  marginLeft: "auto",
  marginRight: "auto",
  lineHeight: "1.5",
};

const emptyStateButton = {
  padding: "10px 24px",
  backgroundColor: "#1e40af",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

export default User;