import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./Quiz.css";

const TOTAL_QUIZ_TIME = 300; // Total time in seconds (e.g., 300s = 5 minutes)

const Quiz = () => {
  const { JobId } = useParams();

  // ---------- STATE ----------
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_QUIZ_TIME); // Single overall timer
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch Quiz Questions
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const payload = {
        jobId: JobId,
        numberOfQuestions: 5,
      };
      const res = await axios.post(
        "https://localhost:7077/api/Assessment/Assessment",
        payload
      );
      setQuestions(res.data?.questions || []);
      setTimeLeft(TOTAL_QUIZ_TIME); // Reset timer on fetch
      setLoading(false);
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError("Failed to load quiz. Please check your connection or API.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [JobId]);

  // Handle auto-submitting when the overall timer hits zero
  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  // Overall Timer Effect
  useEffect(() => {
    if (loading || isSubmitted || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Automatically submit quiz when overall time ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isSubmitted, questions.length, handleSubmit]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Option selection handler
  const handleOptionSelect = (optionText) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionText,
    });
  };

  // Score Calculation
  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  // Reset Quiz State
  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(TOTAL_QUIZ_TIME);
    setIsSubmitted(false);
  };

  // Loading State
  if (loading) {
    return (
      <div className="quiz-container center-text">
        <p>Loading assessment questions...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="quiz-container center-text error-box">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchQuiz}>
          Retry
        </button>
      </div>
    );
  }

  // No Questions Found
  if (questions.length === 0) {
    return (
      <div className="quiz-container center-text">
        <p>No questions available for this Job ID.</p>
      </div>
    );
  }

  // Results View
  if (isSubmitted) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="quiz-container">
        <div className="quiz-card results-card">
          <h2>Assessment Completed! 🎉</h2>
          <div className="score-badge">
            <span className="score-number">{score}</span> / {questions.length}
          </div>
          <p className="score-percentage">Your Score: {percentage}%</p>

          <hr className="divider" />

          <h3>Review Answers</h3>
          <div className="review-list">
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div
                  key={idx}
                  className={`review-item ${isCorrect ? "correct" : "incorrect"}`}
                >
                  <p className="review-question">
                    <strong>Q{idx + 1}:</strong> {q.question}
                  </p>
                  <p className="review-ans">
                    <strong>Your Answer:</strong>{" "}
                    {userAns ? userAns : "Not Answered"}
                  </p>
                  {!isCorrect && (
                    <p className="review-correct">
                      <strong>Correct Answer:</strong> {q.correctAnswer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button className="btn btn-primary mt-20" onClick={handleRestart}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // Active Question View
  const currentQ = questions[currentIndex];
  const options = [
    { key: "A", val: currentQ.optionA },
    { key: "B", val: currentQ.optionB },
    { key: "C", val: currentQ.optionC },
    { key: "D", val: currentQ.optionD },
  ].filter((opt) => opt.val);

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {/* Header: Progress & Overall Timer */}
        <div className="quiz-header">
          <div className="question-progress">
            Question <span>{currentIndex + 1}</span> of {questions.length}
          </div>
          <div
            className={`timer-badge ${timeLeft <= 60 ? "timer-warning" : ""}`}
          >
            ⏱️ Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>

        {/* Question Text */}
        <h3 className="question-text">{currentQ.question}</h3>

        {/* Options Grid */}
        <div className="options-container">
          {options.map((opt) => {
            const isSelected = selectedAnswers[currentIndex] === opt.val;
            return (
              <label
                key={opt.key}
                className={`option-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleOptionSelect(opt.val)}
              >
                <input
                  type="radio"
                  name={`question-${currentIndex}`}
                  value={opt.val}
                  checked={isSelected}
                  onChange={() => {}}
                />
                <span className="option-prefix">{opt.key}</span>
                <span className="option-text">{opt.val}</span>
              </label>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="quiz-footer">
          <button
            className="btn btn-secondary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
          >
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit Quiz
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentIndex((prev) => prev + 1)}
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;