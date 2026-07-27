import axios from "axios";
import { useState } from "react";

const Careeranalysis = () => {

  const [resumeFile, setResumeFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ShowAnalysis = async () => {

    if (!resumeFile) {
      setError("Please upload resume.");
      return;
    }

    try {

      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await axios.post(
        "https://localhost:7077/api/CareerAdvisor",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(res.data);

      setData(res.data);

    } catch (err) {

      console.log(err);

      setError("Unable to analyze resume.");

    } finally {

      setLoading(false);

    }

  };

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {

      alert("Maximum file size is 5 MB");

      return;
    }

    setResumeFile(file);

  };

 return (
  <div className="career-container">

    <style>{`
      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
        font-family:'Segoe UI',sans-serif;
      }

      body{
        background:#f4f7fc;
      }

      .career-container{
        width:100%;
        min-height:100vh;
        background:#f4f7fc;
        display:flex;
        justify-content:center;
        align-items:flex-start;
        padding:40px;
      }

      .career-card{
        width:900px;
        background:#fff;
        border-radius:15px;
        box-shadow:0 10px 30px rgba(0,0,0,.1);
        padding:35px;
      }

      .title{
        text-align:center;
        color:#2b4eff;
        font-size:34px;
        font-weight:bold;
      }

      .subtitle{
        text-align:center;
        color:#666;
        margin-top:10px;
        margin-bottom:30px;
      }

      .upload-box{
        border:2px dashed #2b4eff;
        border-radius:15px;
        padding:35px;
        text-align:center;
        background:#eef3ff;
        transition:.3s;
        cursor:pointer;
      }

      .upload-box:hover{
        background:#dfe8ff;
      }

      input[type=file]{
        margin-top:20px;
      }

      .filename{
        margin-top:15px;
        color:#2b4eff;
        font-weight:bold;
      }

      .btn{
        width:100%;
        margin-top:30px;
        padding:15px;
        border:none;
        border-radius:10px;
        background:#2b4eff;
        color:white;
        font-size:18px;
        cursor:pointer;
        transition:.3s;
      }

      .btn:hover{
        background:#1436d6;
      }

      .btn:disabled{
        background:gray;
        cursor:not-allowed;
      }

      .loading{
        text-align:center;
        color:#2b4eff;
        margin-top:20px;
        font-size:18px;
      }

      .error{
        background:#ffe4e4;
        color:red;
        padding:10px;
        border-radius:8px;
        margin-top:20px;
      }

      .result-card{
        margin-top:40px;
      }

      .section{
        margin-top:25px;
      }

      .section h3{
        color:#2b4eff;
        margin-bottom:15px;
        border-left:5px solid #2b4eff;
        padding-left:10px;
      }

      .badge-container{
        display:flex;
        flex-wrap:wrap;
        gap:12px;
      }

      .badge{
        background:#2b4eff;
        color:white;
        padding:10px 18px;
        border-radius:30px;
        font-size:15px;
      }

      .project{
        background:#f8f9ff;
        padding:15px;
        border-left:5px solid #2b4eff;
        margin-bottom:10px;
        border-radius:8px;
      }

      .time-card{
        margin-top:20px;
        background:#eafaf0;
        color:#14804a;
        font-size:20px;
        text-align:center;
        padding:18px;
        border-radius:10px;
        font-weight:bold;
      }

      .spinner{
        width:22px;
        height:22px;
        border:4px solid white;
        border-top:4px solid transparent;
        border-radius:50%;
        display:inline-block;
        animation:spin 1s linear infinite;
        margin-right:10px;
      }

      @keyframes spin{
        to{
          transform:rotate(360deg);
        }
      }

      @media(max-width:768px){

        .career-card{
          width:100%;
        }

      }

    `}</style>

    <div className="career-card">

      <h1 className="title">AI Career Advisor</h1>

      <p className="subtitle">
        Upload your resume and receive AI-powered career guidance.
      </p>

      <div className="upload-box">

        <h2>📄 Upload Resume</h2>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        {resumeFile && (
          <div className="filename">
            {resumeFile.name}
            <br />
            {(resumeFile.size/1024/1024).toFixed(2)} MB
          </div>
        )}

      </div>

      <button
        className="btn"
        onClick={ShowAnalysis}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Analyzing Resume...
          </>
        ) : (
          "Analyze Resume"
        )}
      </button>

      {error && <div className="error">{error}</div>}

      {data && (

        <div className="result-card">

          <div className="section">

            <h3>🚀 Career Paths</h3>

            <div className="badge-container">
              {data.careerPaths?.map((item,index)=>(
                <div className="badge" key={index}>
                  {item}
                </div>
              ))}
            </div>

          </div>

          <div className="section">

            <h3>📜 Recommended Certifications</h3>

            <div className="badge-container">
              {data.certifications?.map((item,index)=>(
                <div className="badge" key={index}>
                  {item}
                </div>
              ))}
            </div>

          </div>

          <div className="section">

            <h3>💡 Skills To Improve</h3>

            <div className="badge-container">
              {data.skillsToImprove?.map((item,index)=>(
                <div className="badge" key={index}>
                  {item}
                </div>
              ))}
            </div>

          </div>

          <div className="section">

            <h3>📂 Recommended Projects</h3>

            {data.recommendedProjects?.map((item,index)=>(
              <div className="project" key={index}>
                {item}
              </div>
            ))}

          </div>

          <div className="section">

            <h3>⏳ Estimated Time To Become Job Ready</h3>

            <div className="time-card">
              {data.estimatedTimeToBecomeJobReady}
            </div>

          </div>

        </div>

      )}

    </div>

  </div>
);

};

export default Careeranalysis;