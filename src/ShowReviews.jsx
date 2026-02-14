import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ShowReviews = () => {
  const { companyid } = useParams();
  const navigate = useNavigate();
  const [data, setdata] = useState([]);
  const [datas, setdatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form states
  const [jobTitle, setjobTitle] = useState("");
  const [employmentStatus, setemploymentStatus] = useState("Current Employee");
  const [location, setlocation] = useState("");
  const [workLifeBalance, setworkLifeBalance] = useState(0);
  const [compensationBenefits, setcompensationBenefits] = useState(0);
  const [jobSecurity, setjobSecurity] = useState(0);
  const [careerGrowth, setcareerGrowth] = useState(0);
  const [management, setmanagement] = useState(0);
  const [culture, setculture] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [pros, setpros] = useState("");
  const [cons, setcons] = useState("");
  const [adviceToManagement, setadviceToManagement] = useState("");
  const [isAnonymous, setisAnonymous] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const AddReviews = async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    if (!jobTitle.trim()) errors.jobTitle = "Job title is required";
    if (!location.trim()) errors.location = "Location is required";
    if (!pros.trim()) errors.pros = "Pros are required";
    if (!cons.trim()) errors.cons = "Cons are required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setFormLoading(true);
      const payload = {
        companyId: Number(companyid),
        jobTitle,
        employmentStatus,
        location,
        workLifeBalance,
        compensationBenefits,
        jobSecurity,
        careerGrowth,
        management,
        culture,
        pros,
        cons,
        adviceToManagement,
        isAnonymous 
      };
      console.log(payload);
      const res = await axios.post("https://localhost:7163/api/CompanyReviewsContoller", payload);
      setdata([...data, res.data]);
      
      // Reset form
      resetForm();
      setShowReviewForm(false);
      setFormErrors({});
      
      // Refresh summary data
      GetReviewsSummary();
    } catch (err) {
      console.log("Add data failed", err.message);
      setError("Failed to submit review. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setjobTitle("");
    setemploymentStatus("Current Employee");
    setlocation("");
    setworkLifeBalance(3);
    setcompensationBenefits(3);
    setjobSecurity(3);
    setcareerGrowth(3);
    setmanagement(3);
    setculture(3);
    setOverallRating(3);
    setpros("");
    setcons("");
    setadviceToManagement("");
    setisAnonymous(false);
  };

  const GetReviews = async () => {
    try {
      const res = await axios.get(`https://localhost:7163/api/CompanyReviewsContoller/company/${companyid}`);
      setdata(res.data);
      setError("");
    } catch (err) {
      console.log("data not found", err.message);
      setError("Failed to load reviews. Please try again.");
    }
  };

  const GetReviewsSummary = async () => {
    try {
      const res = await axios.get(`https://localhost:7163/api/CompanyReviewsContoller/company/${companyid}/summary`);
      setdatas(res.data);
    } catch (err) {
      console.log("data not found", err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([GetReviews(), GetReviewsSummary()]);
      setLoading(false);
    };
    fetchData();
  }, [companyid]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} style={styles.star}>★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} style={styles.starHalf}>★</span>);
      } else {
        stars.push(<span key={i} style={styles.starEmpty}>★</span>);
      }
    }
    
    return (
      <div style={styles.starsContainer}>
        {stars}
        <span style={styles.ratingValue}>{rating?.toFixed(1)}</span>
      </div>
    );
  };

  const renderRatingBar = (label, value, max = 5) => {
    const percentage = (value / max) * 100;
    
    return (
      <div style={styles.ratingBarItem}>
        <span style={styles.ratingBarLabel}>{label}</span>
        <div style={styles.ratingBarContainer}>
          <div 
            style={{
              ...styles.ratingBarFill,
              width: `${percentage}%`,
              backgroundColor: value >= 4 ? '#2e7d32' : value >= 3 ? '#ff9800' : '#d32f2f'
            }}
          ></div>
        </div>
        <span style={styles.ratingBarValue}>{value?.toFixed(1)}</span>
      </div>
    );
  };

  const renderStarInput = (label, value, onChange) => {
    return (
      <div style={styles.starInputContainer}>
        <label style={styles.starInputLabel}>{label}</label>
        <div style={styles.starInputGroup}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              style={star <= value ? styles.starButtonActive : styles.starButton}
              onClick={() => onChange(star)}
              onMouseEnter={(e) => {
                if (e.relatedTarget) e.currentTarget.style.transform = "scale(1.2)";
              }}
              onMouseLeave={(e) => {
                if (e.relatedTarget) e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ★
            </button>
          ))}
          <span style={styles.starValue}>{value}/5</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>
            ← Back to Companies
          </button>
          <div style={styles.headerTitle}>
            <h1 style={styles.mainTitle}>Company Reviews</h1>
            <p style={styles.companyId}>Company ID: {companyid}</p>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Error State */}
        {error && (
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3 style={styles.errorTitle}>Unable to Load Reviews</h3>
            <p style={styles.errorMessage}>{error}</p>
            <button style={styles.retryButton} onClick={GetReviews}>
              Try Again
            </button>
          </div>
        )}

        {/* Summary Section */}
        {datas && (
          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <h2 style={styles.summaryTitle}>Company Rating Summary</h2>
              <div style={styles.overallRating}>
                <span style={styles.overallRatingValue}>{datas.avgOverallRating?.toFixed(1)}</span>
                <span style={styles.overallRatingMax}>/5</span>
                <div style={styles.ratingStarsLarge}>
                  {renderStars(datas.avgOverallRating || 0)}
                </div>
              </div>
            </div>
            
            <div style={styles.ratingBars}>
              {datas.avgOverallRating && renderRatingBar("Overall Rating", datas.avgOverallRating)}
              {datas.avgWorkLifeBalance && renderRatingBar("Work-Life Balance", datas.avgWorkLifeBalance)}
              {datas.avgCompensation && renderRatingBar("Compensation", datas.avgCompensation)}
              {datas.avgJobSecurity && renderRatingBar("Job Security", datas.avgJobSecurity)}
              {datas.avgCareerGrowth && renderRatingBar("Career Growth", datas.avgCareerGrowth)}
              {datas.avgManagement && renderRatingBar("Management", datas.avgManagement)}
              {datas.avgCulture && renderRatingBar("Culture", datas.avgCulture)}
            </div>
            
            <div style={styles.summaryFooter}>
              <div style={styles.reviewCount}>
                <span style={styles.reviewCountIcon}>📊</span>
                <span style={styles.reviewCountText}>
                  Based on <strong>{datas.totalReviews || 0}</strong> employee reviews
                </span>
              </div>
              <div style={styles.lastUpdated}>
                Last updated: {formatDate(datas.lastUpdated)}
              </div>
            </div>
          </div>
        )}

        {/* Add Review Section */}
        <div style={styles.addReviewSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Share Your Experience</h2>
            {!showReviewForm ? (
              <button 
                style={styles.addReviewButton}
                onClick={() => setShowReviewForm(true)}
              >
                <span style={styles.buttonIcon}>✍️</span>
                Write a Review
              </button>
            ) : (
              <button 
                style={styles.cancelReviewButton}
                onClick={() => {
                  setShowReviewForm(false);
                  resetForm();
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
            )}
          </div>

          {showReviewForm && (
            <div style={styles.reviewFormCard}>
              <form onSubmit={AddReviews}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      Job Title *
                      {formErrors.jobTitle && (
                        <span style={styles.errorText}> {formErrors.jobTitle}</span>
                      )}
                    </label>
                    <input
                      style={styles.formInput}
                      type="text"
                      placeholder="e.g., Software Engineer, Marketing Manager"
                      value={jobTitle}
                      onChange={(e) => setjobTitle(e.target.value)}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Employment Status</label>
                    <select
                      style={styles.formSelect}
                      value={employmentStatus}
                      onChange={(e) => setemploymentStatus(e.target.value)}
                    >
                      <option value="Current Employee">Current Employee</option>
                      <option value="Former Employee">Former Employee</option>
                      <option value="Intern">Intern</option>
                      <option value="Contractor">Contractor</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      Location *
                      {formErrors.location && (
                        <span style={styles.errorText}> {formErrors.location}</span>
                      )}
                    </label>
                    <input
                      style={styles.formInput}
                      type="text"
                      placeholder="e.g., San Francisco, CA"
                      value={location}
                      onChange={(e) => setlocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Rating Inputs */}
                <div style={styles.ratingsSection}>
                  <h3 style={styles.ratingsTitle}>Rate Your Experience (1-5 stars)</h3>
                  <div style={styles.starInputsGrid}>
                    {renderStarInput("Overall Rating", overallRating, setOverallRating)}
                    {renderStarInput("Work-Life Balance", workLifeBalance, setworkLifeBalance)}
                    {renderStarInput("Compensation & Benefits", compensationBenefits, setcompensationBenefits)}
                    {renderStarInput("Job Security", jobSecurity, setjobSecurity)}
                    {renderStarInput("Career Growth", careerGrowth, setcareerGrowth)}
                    {renderStarInput("Management", management, setmanagement)}
                    {renderStarInput("Culture", culture, setculture)}
                  </div>
                </div>

                <div style={styles.textAreasSection}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      Pros *
                      {formErrors.pros && (
                        <span style={styles.errorText}> {formErrors.pros}</span>
                      )}
                    </label>
                    <textarea
                      style={styles.formTextarea}
                      placeholder="What did you like about working here? What are the company's strengths?"
                      value={pros}
                      onChange={(e) => setpros(e.target.value)}
                      rows="4"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      Cons *
                      {formErrors.cons && (
                        <span style={styles.errorText}> {formErrors.cons}</span>
                      )}
                    </label>
                    <textarea
                      style={styles.formTextarea}
                      placeholder="What challenges did you face? What could be improved?"
                      value={cons}
                      onChange={(e) => setcons(e.target.value)}
                      rows="4"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Advice to Management</label>
                    <textarea
                      style={styles.formTextarea}
                      placeholder="What advice would you give to the company's management?"
                      value={adviceToManagement}
                      onChange={(e) => setadviceToManagement(e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>

                <div style={styles.formFooter}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setisAnonymous(e.target.checked)}
                      style={styles.checkbox}
                    />
                    Post anonymously
                  </label>
                  
                  <div style={styles.formActions}>
                    <button 
                      type="button" 
                      style={styles.cancelButton}
                      onClick={() => {
                        setShowReviewForm(false);
                        resetForm();
                        setFormErrors({});
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      style={formLoading ? styles.submitButtonDisabled : styles.submitButton}
                      disabled={formLoading}
                    >
                      {formLoading ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div style={styles.reviewsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Employee Reviews {data.length > 0 && `(${data.length})`}
            </h2>
            <div style={styles.sortContainer}>
              <select style={styles.sortSelect}>
                <option value="newest">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          {data.length === 0 ? (
            <div style={styles.emptyReviews}>
              <div style={styles.emptyIcon}>📝</div>
              <h3 style={styles.emptyTitle}>No Reviews Yet</h3>
              <p style={styles.emptyText}>
                Be the first to share your experience with this company!
              </p>
              <button 
                style={styles.writeFirstReviewButton}
                onClick={() => setShowReviewForm(true)}
              >
                Write First Review
              </button>
            </div>
          ) : (
            <div style={styles.reviewsGrid}>
              {data.map((review, index) => (
                <div key={index} style={styles.reviewCard}>
                  {/* Review Header */}
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewerInfo}>
                      <div style={styles.reviewerAvatar}>
                        {review.jobTitle?.charAt(0) || "E"}
                      </div>
                      <div>
                        <h3 style={styles.jobTitle}>
                          {review.isAnonymous ? "Anonymous Employee" : (review.jobTitle || "Employee")}
                        </h3>
                        <div style={styles.reviewMeta}>
                          <span style={styles.employmentStatus}>{review.employmentStatus || "Current Employee"}</span>
                          {review.location && (
                            <span style={styles.location}> • {review.location}</span>
                          )}
                          <span style={styles.reviewDateMobile}>
                            • {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={styles.reviewRating}>
                      {renderStars(review.overallRating)}
                      <span style={styles.reviewDate}>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>

                  {/* Detailed Ratings */}
                  <div style={styles.detailedRatings}>
                    {review.workLifeBalance && (
                      <div style={styles.detailedRatingItem}>
                        <span style={styles.detailedRatingLabel}>Work-Life Balance</span>
                        {renderStars(review.workLifeBalance)}
                      </div>
                    )}
                    {review.compensationBenefits && (
                      <div style={styles.detailedRatingItem}>
                        <span style={styles.detailedRatingLabel}>Compensation</span>
                        {renderStars(review.compensationBenefits)}
                      </div>
                    )}
                    {review.jobSecurity && (
                      <div style={styles.detailedRatingItem}>
                        <span style={styles.detailedRatingLabel}>Job Security</span>
                        {renderStars(review.jobSecurity)}
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div style={styles.reviewContent}>
                    {review.pros && (
                      <div style={styles.prosCard}>
                        <div style={styles.cardHeader}>
                          <span style={styles.prosIcon}>👍</span>
                          <h4 style={styles.cardTitle}>Pros</h4>
                        </div>
                        <p style={styles.cardText}>{review.pros}</p>
                      </div>
                    )}
                    
                    {review.cons && (
                      <div style={styles.consCard}>
                        <div style={styles.cardHeader}>
                          <span style={styles.consIcon}>👎</span>
                          <h4 style={styles.cardTitle}>Cons</h4>
                        </div>
                        <p style={styles.cardText}>{review.cons}</p>
                      </div>
                    )}
                    
                    {review.adviceToManagement && (
                      <div style={styles.adviceCard}>
                        <div style={styles.cardHeader}>
                          <span style={styles.adviceIcon}>💡</span>
                          <h4 style={styles.cardTitle}>Advice to Management</h4>
                        </div>
                        <p style={styles.cardText}>{review.adviceToManagement}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS styles with Indeed-like design
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #2557a7",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#666",
  },
  header: {
    backgroundColor: "#2557a7",
    color: "white",
    padding: "20px 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  backButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  },
  headerTitle: {
    flex: 1,
  },
  mainTitle: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 4px 0",
  },
  companyId: {
    fontSize: "14px",
    opacity: "0.8",
    margin: "0",
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  errorCard: {
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: "8px",
    padding: "30px",
    textAlign: "center",
    marginBottom: "30px",
  },
  errorIcon: {
    fontSize: "40px",
    marginBottom: "20px",
  },
  errorTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#721c24",
    marginBottom: "10px",
  },
  errorMessage: {
    fontSize: "16px",
    color: "#721c24",
    marginBottom: "20px",
  },
  retryButton: {
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
  summaryCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e1e5e9",
  },
  summaryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e1e5e9",
    flexWrap: "wrap",
    gap: "20px",
  },
  summaryTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
    margin: "0",
  },
  overallRating: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    backgroundColor: "#f0f7ff",
    padding: "15px 25px",
    borderRadius: "8px",
    border: "1px solid #2557a7",
  },
  overallRatingValue: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#2557a7",
  },
  overallRatingMax: {
    fontSize: "20px",
    color: "#666",
    marginLeft: "4px",
  },
  ratingStarsLarge: {
    display: "flex",
    alignItems: "center",
  },
  ratingBars: {
    marginBottom: "20px",
  },
  ratingBarItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    gap: "15px",
  },
  ratingBarLabel: {
    width: "140px",
    fontSize: "14px",
    color: "#333",
    fontWeight: "500",
  },
  ratingBarContainer: {
    flex: 1,
    height: "8px",
    backgroundColor: "#e1e5e9",
    borderRadius: "4px",
    overflow: "hidden",
  },
  ratingBarFill: {
    height: "100%",
    borderRadius: "4px",
  },
  ratingBarValue: {
    width: "40px",
    textAlign: "right",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  summaryFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "20px",
    borderTop: "1px solid #e1e5e9",
  },
  reviewCount: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  reviewCountIcon: {
    fontSize: "18px",
  },
  reviewCountText: {
    fontSize: "14px",
    color: "#666",
  },
  lastUpdated: {
    fontSize: "12px",
    color: "#888",
  },
  addReviewSection: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e1e5e9",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
    margin: "0",
  },
  addReviewButton: {
    backgroundColor: "#2557a7",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
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
  cancelReviewButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#5a6268",
    },
  },
  buttonIcon: {
    fontSize: "16px",
  },
  reviewFormCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "30px",
    border: "1px solid #e1e5e9",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#333",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "12px",
    fontWeight: "normal",
  },
  formInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #e1e5e9",
    fontSize: "14px",
    boxSizing: "border-box",
    "&:focus": {
      outline: "none",
      borderColor: "#2557a7",
      boxShadow: "0 0 0 3px rgba(37, 87, 167, 0.1)",
    },
  },
  formSelect: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #e1e5e9",
    fontSize: "14px",
    backgroundColor: "white",
    cursor: "pointer",
    "&:focus": {
      outline: "none",
      borderColor: "#2557a7",
    },
  },
  ratingsSection: {
    marginBottom: "30px",
    paddingBottom: "30px",
    borderBottom: "1px solid #e1e5e9",
  },
  ratingsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
  },
  starInputsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  starInputContainer: {
    marginBottom: "15px",
  },
  starInputLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "8px",
    color: "#555",
  },
  starInputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  starButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    color: "#ddd",
    cursor: "pointer",
    transition: "transform 0.2s, color 0.2s",
    padding: "0",
    "&:hover": {
      color: "#ffb400",
      transform: "scale(1.2)",
    },
  },
  starButtonActive: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    color: "#ffb400",
    cursor: "pointer",
    transition: "transform 0.2s",
    padding: "0",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
  starValue: {
    marginLeft: "10px",
    fontSize: "14px",
    color: "#666",
    fontWeight: "600",
  },
  textAreasSection: {
    marginBottom: "30px",
  },
  formTextarea: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #e1e5e9",
    fontSize: "14px",
    resize: "vertical",
    minHeight: "80px",
    boxSizing: "border-box",
    "&:focus": {
      outline: "none",
      borderColor: "#2557a7",
      boxShadow: "0 0 0 3px rgba(37, 87, 167, 0.1)",
    },
  },
  formFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "20px",
    borderTop: "1px solid #e1e5e9",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#666",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  formActions: {
    display: "flex",
    gap: "15px",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#5a6268",
    },
  },
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: "#a0a0a0",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  reviewsSection: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e1e5e9",
  },
  sortContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  sortSelect: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #e1e5e9",
    fontSize: "14px",
    backgroundColor: "white",
    cursor: "pointer",
  },
  emptyReviews: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "20px",
    opacity: "0.5",
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
    maxWidth: "400px",
    margin: "0 auto",
  },
  writeFirstReviewButton: {
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
  reviewsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
  },
  reviewCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "24px",
    border: "1px solid #e1e5e9",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e1e5e9",
    flexWrap: "wrap",
    gap: "15px",
  },
  reviewerInfo: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  reviewerAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#2557a7",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "600",
    flexShrink: 0,
  },
  jobTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 6px 0",
  },
  reviewMeta: {
    fontSize: "14px",
    color: "#666",
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },
  employmentStatus: {
    fontWeight: "500",
  },
  location: {
    color: "#888",
  },
  reviewDateMobile: {
    color: "#888",
    display: "none",
    "@media (max-width: 768px)": {
      display: "inline",
    },
  },
  reviewRating: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
    textAlign: "right",
  },
  starsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  star: {
    color: "#ffb400",
    fontSize: "18px",
  },
  starHalf: {
    color: "#ffb400",
    fontSize: "18px",
    opacity: "0.7",
  },
  starEmpty: {
    color: "#ddd",
    fontSize: "18px",
  },
  ratingValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginLeft: "8px",
  },
  reviewDate: {
    fontSize: "12px",
    color: "#888",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  detailedRatings: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e1e5e9",
  },
  detailedRatingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailedRatingLabel: {
    fontSize: "14px",
    color: "#666",
  },
  reviewContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  prosCard: {
    backgroundColor: "#e8f5e9",
    padding: "16px",
    borderRadius: "6px",
    borderLeft: "4px solid #2e7d32",
  },
  consCard: {
    backgroundColor: "#ffebee",
    padding: "16px",
    borderRadius: "6px",
    borderLeft: "4px solid #d32f2f",
  },
  adviceCard: {
    backgroundColor: "#e3f2fd",
    padding: "16px",
    borderRadius: "6px",
    borderLeft: "4px solid #1976d2",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  prosIcon: {
    fontSize: "18px",
    color: "#2e7d32",
  },
  consIcon: {
    fontSize: "18px",
    color: "#d32f2f",
  },
  adviceIcon: {
    fontSize: "18px",
    color: "#1976d2",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    margin: "0",
  },
  cardText: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    margin: "0",
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

export default ShowReviews;