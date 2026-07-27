import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "https://localhost:7163/api";

const ShowReviews = () => {
  const { companyid } = useParams();
  const navigate = useNavigate();

  // Component States
  const [data, setdata] = useState([]);
  const [datas, setdatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [rdata, setrdata] = useState(undefined);

  // Form States
  const [jobTitle, setjobTitle] = useState("");
  const [employmentStatus, setemploymentStatus] = useState("Current Employee");
  const [location, setlocation] = useState("");
  const [workLifeBalance, setworkLifeBalance] = useState(3);
  const [compensationBenefits, setcompensationBenefits] = useState(3);
  const [jobSecurity, setjobSecurity] = useState(3);
  const [careerGrowth, setcareerGrowth] = useState(3);
  const [management, setmanagement] = useState(3);
  const [culture, setculture] = useState(3);
  const [overallRating, setOverallRating] = useState(3);
  const [pros, setpros] = useState("");
  const [cons, setcons] = useState("");
  const [adviceToManagement, setadviceToManagement] = useState("");
  const [isAnonymous, setisAnonymous] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
    setFormErrors({});
  };

  const AddReviews = async (e) => {
    e.preventDefault();

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
        overallRating,
        pros,
        cons,
        adviceToManagement,
        isAnonymous,
      };

      const res = await axios.post(
        `${BASE_URL}/CompanyReviewsContoller`,
        payload
      );
      setdata((prevData) => [...prevData, res.data]);

      resetForm();
      setShowReviewForm(false);
      GetReviewsSummary();
    } catch (err) {
      console.error("Add data failed:", err.message);
      setError("Failed to submit review. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const ReviewSummary = async (id) => {
    try {
      const res = await axios.post(`${BASE_URL}/CompanyReviewSummary/${id}`,id);
      setrdata(res.data);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  const GetReviews = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/CompanyReviewsContoller/company/${companyid}`
      );
      setdata(res.data || []);
      setError("");
    } catch (err) {
      console.error("Data not found:", err.message);
      setError("Failed to load reviews. Please try again.");
    }
  };

  const GetReviewsSummary = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/CompanyReviewsContoller/company/${companyid}/summary`
      );
      setdatas(res.data);
    } catch (err) {
      console.error("Summary data not found:", err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([GetReviews(), GetReviewsSummary()]);
      setLoading(false);
    };
    if (companyid) {
      fetchData();
    }
  }, [companyid]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} style={styles.star}>
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} style={styles.starHalf}>
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} style={styles.starEmpty}>
            ☆
          </span>
        );
      }
    }

    return (
      <div style={styles.starsContainer}>
        {stars}
        <span style={styles.ratingValue}>{rating?.toFixed(1)}</span>
      </div>
    );
  };

  const renderRatingBar = (label, value = 0, max = 5) => {
    const percentage = (value / max) * 100;
    const barColor =
      value >= 4 ? "#2e7d32" : value >= 3 ? "#ff9800" : "#d32f2f";

    return (
      <div style={styles.ratingBarItem}>
        <span style={styles.ratingBarLabel}>{label}</span>
        <div style={styles.ratingBarContainer}>
          <div
            style={{
              ...styles.ratingBarFill,
              width: `${percentage}%`,
              backgroundColor: barColor,
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
              style={
                star <= value ? styles.starButtonActive : styles.starButton
              }
              onClick={() => onChange(star)}
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
                <span style={styles.overallRatingValue}>
                  {datas.avgOverallRating?.toFixed(1)}
                </span>
                <span style={styles.overallRatingMax}>/5</span>
                <div style={styles.ratingStarsLarge}>
                  {renderStars(datas.avgOverallRating || 0)}
                </div>
              </div>
            </div>

            <div style={styles.ratingBars}>
              {datas.avgOverallRating &&
                renderRatingBar("Overall Rating", datas.avgOverallRating)}
              {datas.avgWorkLifeBalance &&
                renderRatingBar("Work-Life Balance", datas.avgWorkLifeBalance)}
              {datas.avgCompensation &&
                renderRatingBar("Compensation", datas.avgCompensation)}
              {datas.avgJobSecurity &&
                renderRatingBar("Job Security", datas.avgJobSecurity)}
              {datas.avgCareerGrowth &&
                renderRatingBar("Career Growth", datas.avgCareerGrowth)}
              {datas.avgManagement &&
                renderRatingBar("Management", datas.avgManagement)}
              {datas.avgCulture &&
                renderRatingBar("Culture", datas.avgCulture)}
            </div>

            <div style={styles.summaryFooter}>
              <div style={styles.reviewCount}>
                <span style={styles.reviewCountIcon}>📊</span>
                <span style={styles.reviewCountText}>
                  Based on <strong>{datas.totalReviews || 0}</strong> employee
                  reviews
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
                <span style={styles.buttonIcon}>✍️</span> Write a Review
              </button>
            ) : (
              <button
                style={styles.cancelReviewButton}
                onClick={() => {
                  setShowReviewForm(false);
                  resetForm();
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
                        <span style={styles.errorText}>
                          {" "}
                          {formErrors.jobTitle}
                        </span>
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
                        <span style={styles.errorText}>
                          {" "}
                          {formErrors.location}
                        </span>
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

                <div style={styles.ratingsSection}>
                  <h3 style={styles.ratingsTitle}>
                    Rate Your Experience (1-5 stars)
                  </h3>
                  <div style={styles.starInputsGrid}>
                    {renderStarInput(
                      "Overall Rating",
                      overallRating,
                      setOverallRating
                    )}
                    {renderStarInput(
                      "Work-Life Balance",
                      workLifeBalance,
                      setworkLifeBalance
                    )}
                    {renderStarInput(
                      "Compensation & Benefits",
                      compensationBenefits,
                      setcompensationBenefits
                    )}
                    {renderStarInput(
                      "Job Security",
                      jobSecurity,
                      setjobSecurity
                    )}
                    {renderStarInput(
                      "Career Growth",
                      careerGrowth,
                      setcareerGrowth
                    )}
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
                      placeholder="What did you like about working here?"
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
                      placeholder="What challenges did you face?"
                      value={cons}
                      onChange={(e) => setcons(e.target.value)}
                      rows="4"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Advice to Management</label>
                    <textarea
                      style={styles.formTextarea}
                      placeholder="What advice would you give management?"
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
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={
                        formLoading
                          ? styles.submitButtonDisabled
                          : styles.submitButton
                      }
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

        {/* Reviews List Section */}
        <div style={styles.reviewsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Employee Reviews {data.length > 0 && `(${data.length})`}
            </h2>
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
              {data.map((review, idx) => (
                <div key={review.id || idx} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewerInfo}>
                      <div style={styles.reviewerAvatar}>
                        {review.jobTitle?.charAt(0) || "E"}
                      </div>
                      <div>
                        <h3 style={styles.jobTitle}>
                          {review.isAnonymous
                            ? "Anonymous Employee"
                            : review.jobTitle || "Employee"}
                        </h3>
                        <div style={styles.reviewMeta}>
                          <span>
                            {review.employmentStatus || "Current Employee"}
                          </span>
                          {review.location && <span> • {review.location}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={styles.reviewRating}>
                      {renderStars(review.overallRating)}
                      <span style={styles.reviewDate}>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div style={styles.reviewContent}>
                    {review.pros && (
                      <div style={styles.prosCard}>
                        <h4 style={styles.cardTitle}>👍 Pros</h4>
                        <p style={styles.cardText}>{review.pros}</p>
                      </div>
                    )}
                    {review.cons && (
                      <div style={styles.consCard}>
                        <h4 style={styles.cardTitle}>👎 Cons</h4>
                        <p style={styles.cardText}>{review.cons}</p>
                      </div>
                    )}
                    {review.adviceToManagement && (
                      <div style={styles.adviceCard}>
                        <h4 style={styles.cardTitle}>
                          💡 Advice to Management
                        </h4>
                        <p style={styles.cardText}>
                          {review.adviceToManagement}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed AI / Generated Summary Output */}
        <div style={{ marginTop: "40px" }}>
          <button
            style={styles.addReviewButton}
            onClick={() => ReviewSummary(companyid)}
          >
            Fetch AI Executive Summary
          </button>

          {rdata && (
            <div style={{ ...styles.summaryCard, marginTop: "20px" }}>
              <h2>{rdata.companyName}</h2>
              <p><strong>Industry:</strong> {rdata.industry}</p>
              <p><strong>Headquarters:</strong> {rdata.headquarters}</p>
              <p><strong>Company Size:</strong> {rdata.companySize}</p>
              <p><strong>Overall Sentiment:</strong> {rdata.overallSentiment} ({rdata.sentimentPercentage}%)</p>
              <p><strong>Summary:</strong> {rdata.summary}</p>

              {rdata.pros?.length > 0 && (
                <div>
                  <h4>Key Pros</h4>
                  <ul>
                    {rdata.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rdata.cons?.length > 0 && (
                <div>
                  <h4>Key Cons</h4>
                  <ul>
                    {rdata.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rdata.recommendations?.length > 0 && (
                <div>
                  <h4>Recommendations</h4>
                  <ul>
                    {rdata.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles object definition
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
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #2557a7",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    marginBottom: "16px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#666",
  },
  header: {
    backgroundColor: "#2557a7",
    color: "white",
    padding: "20px 0",
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
    border: "1px solid rgba(255,255,255,0.4)",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  headerTitle: { flex: 1 },
  mainTitle: { fontSize: "28px", margin: "0 0 4px 0" },
  companyId: { fontSize: "14px", opacity: "0.8", margin: "0" },
  mainContent: { maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" },
  errorCard: {
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    marginBottom: "20px",
  },
  errorIcon: { fontSize: "32px" },
  errorTitle: { color: "#721c24", margin: "10px 0" },
  errorMessage: { color: "#721c24" },
  retryButton: {
    backgroundColor: "#2557a7",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #e1e5e9",
  },
  summaryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  summaryTitle: { fontSize: "22px", margin: "0" },
  overallRating: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f0f7ff",
    padding: "10px 18px",
    borderRadius: "8px",
  },
  overallRatingValue: { fontSize: "32px", fontWeight: "bold", color: "#2557a7" },
  overallRatingMax: { fontSize: "18px", color: "#666" },
  ratingStarsLarge: { marginLeft: "8px" },
  starsContainer: { display: "flex", alignItems: "center", gap: "4px" },
  star: { color: "#ffb400", fontSize: "18px" },
  starHalf: { color: "#ffb400", fontSize: "18px" },
  starEmpty: { color: "#ccc", fontSize: "18px" },
  ratingValue: { marginLeft: "6px", fontSize: "14px", fontWeight: "bold" },
  ratingBars: { marginBottom: "20px" },
  ratingBarItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    gap: "12px",
  },
  ratingBarLabel: { width: "160px", fontSize: "14px", color: "#333" },
  ratingBarContainer: {
    flex: 1,
    height: "8px",
    backgroundColor: "#e1e5e9",
    borderRadius: "4px",
    overflow: "hidden",
  },
  ratingBarFill: { height: "100%", borderRadius: "4px" },
  ratingBarValue: { width: "36px", fontSize: "14px", fontWeight: "bold" },
  summaryFooter: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #e1e5e9",
    paddingTop: "12px",
  },
  reviewCount: { display: "flex", gap: "6px", fontSize: "14px" },
  reviewCountIcon: { fontSize: "16px" },
  reviewCountText: { color: "#666" },
  lastUpdated: { fontSize: "12px", color: "#888" },
  addReviewSection: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #e1e5e9",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  sectionTitle: { fontSize: "20px", margin: "0" },
  addReviewButton: {
    backgroundColor: "#2557a7",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelReviewButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  buttonIcon: { marginRight: "6px" },
  reviewFormCard: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e1e5e9",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  formGroup: { marginBottom: "16px" },
  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  errorText: { color: "#d32f2f", fontSize: "12px" },
  formInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  formSelect: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "white",
  },
  ratingsSection: { margin: "20px 0" },
  ratingsTitle: { fontSize: "16px", marginBottom: "12px" },
  starInputsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },
  starInputContainer: { marginBottom: "8px" },
  starInputLabel: { display: "block", fontSize: "13px", color: "#555" },
  starInputGroup: { display: "flex", alignItems: "center", gap: "4px" },
  starButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "20px",
    color: "#ccc",
    cursor: "pointer",
  },
  starButtonActive: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "20px",
    color: "#ffb400",
    cursor: "pointer",
  },
  starValue: { marginLeft: "8px", fontSize: "12px", color: "#666" },
  textAreasSection: { marginBottom: "20px" },
  formTextarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  formFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e1e5e9",
    paddingTop: "16px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  checkbox: { cursor: "pointer" },
  formActions: { display: "flex", gap: "12px" },
  cancelButton: {
    backgroundColor: "transparent",
    border: "1px solid #ccc",
    padding: "10px 18px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#2557a7",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "not-allowed",
  },
  reviewsSection: { marginTop: "24px" },
  emptyReviews: {
    backgroundColor: "white",
    padding: "40px",
    textAlign: "center",
    borderRadius: "8px",
    border: "1px solid #e1e5e9",
  },
  emptyIcon: { fontSize: "40px" },
  emptyTitle: { margin: "10px 0" },
  emptyText: { color: "#666", marginBottom: "16px" },
  writeFirstReviewButton: {
    backgroundColor: "#2557a7",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  reviewsGrid: { display: "flex", flexDirection: "column", gap: "16px" },
  reviewCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e1e5e9",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  reviewerInfo: { display: "flex", gap: "12px", alignItems: "center" },
  reviewerAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  jobTitle: { margin: "0 0 4px 0", fontSize: "16px" },
  reviewMeta: { fontSize: "13px", color: "#666" },
  reviewRating: { textAlign: "right" },
  reviewDate: { display: "block", fontSize: "12px", color: "#888", marginTop: "4px" },
  reviewContent: { display: "flex", flexDirection: "column", gap: "12px" },
  prosCard: { backgroundColor: "#f0fdf4", padding: "12px", borderRadius: "6px" },
  consCard: { backgroundColor: "#fef2f2", padding: "12px", borderRadius: "6px" },
  adviceCard: { backgroundColor: "#f0f9ff", padding: "12px", borderRadius: "6px" },
  cardTitle: { margin: "0 0 6px 0", fontSize: "14px" },
  cardText: { margin: "0", fontSize: "14px", color: "#333" },
};

export default ShowReviews;