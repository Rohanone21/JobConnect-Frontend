import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Quiz.css";

const Quiz = () => {
  const { JobId } = useParams();

  // ---------- STATE ----------
  const [data, setData] = useState({});
  const [answers, setAnswers] = useState(
    JSON.parse(localStorage.getItem(`quiz_answers_${JobId}`)) || {}
  );
  const [score, setScore] = useState(
    Number(localStorage.getItem(`quiz_score_${JobId}`)) || 0
  );
  const [show, setShow] = useState(false);

  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem(`quiz_seconds_${JobId}`);
    return saved ? Number(saved) : 60; // default 60 seconds
  });

  const [shows,setshows]=useState(true);
  // ---------- API ----------
  const ShowQuiz = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7281/api/Test/company/${JobId}/test/${JobId}/questions-with-answers`
      );
      setData(res.data);
    } catch (err) {
      console.log("error", err.message);
    }
  };

  // ---------- TIMER ----------
  useEffect(() => {
    ShowQuiz();

    if (localStorage.getItem(`quiz_submitted_${JobId}`)) {
      setSeconds(0);
      setShow(true);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem(`quiz_seconds_${JobId}`);
          setShow(true);
          return 0;
        }
        localStorage.setItem(`quiz_seconds_${JobId}`, prev - 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------- SCORE CALCULATION ----------
  useEffect(() => {
    let calculatedScore = 0;
    Object.entries(answers).forEach(([questionId, optionId]) => {
      const question = data.questions?.find(
        (q) => q.id.toString() === questionId
      );
      if (question) {
        const selectedOption = question.options.find(
          (o) => o.id.toString() === optionId
        );
        if (selectedOption?.isCorrect) calculatedScore++;
      }
    });
    setScore(calculatedScore);
    localStorage.setItem(`quiz_score_${JobId}`, calculatedScore);
  }, [answers, data.questions]);

  // ---------- FORMAT TIME ----------
  const formatTime = (time) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ---------- ANSWER HANDLER ----------
  const handleOptionChange = (questionId, optionId) => {
    const updated = { ...answers, [questionId]: optionId };
    setAnswers(updated);
    localStorage.setItem(`quiz_answers_${JobId}`, JSON.stringify(updated));
  };

  // ---------- SUBMIT ----------
  const SubmitTest = () => {
    if (confirm("Are you sure you want to submit the test?")) {
      setSeconds(0);
      setShow(true);
      setshows(false);
      localStorage.setItem(`quiz_submitted_${JobId}`, "true");
      localStorage.removeItem(`quiz_seconds_${JobId}`);
    }
  };

  return (
    <div className="quiz-container">
      <h2>Timer: {formatTime(seconds)}</h2>

      <div className="quiz-header">
        <p>Duration: {data.durationMinutes} minutes</p>
        <div className="score-box">Score: {score}</div>
      </div>

      {seconds > 0 &&
        data.questions?.map((q, index) => (
          <div key={q.id} className="question-card">
            <p className="question-text">
              Q{index + 1}. {q.questionText}
            </p>

            {q.options?.map((o) => (
              <label key={o.id} className="option">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  disabled={seconds === 0}
                  checked={answers[q.id] === o.id.toString()}
                  onChange={() =>
                    handleOptionChange(q.id.toString(), o.id.toString())
                  }
                />
                <span>{o.optionText}</span>
              </label>
            ))}
          </div>
        ))}

      <div className="submit-section">
        {shows&&<button onClick={SubmitTest}>Submit Test</button>}

        {seconds === 0 && show && (
          <div
            className={`result ${
              score >= 2 ? "pass" : "fail"
            }`}
          >
            {score >= 2
              ? "🎉 Passed! You will shortly receive an interview call"
              : "❌ Not shortlisted. Better luck next time"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
