import Register from "./pages/Register";
import Login from "./pages/Login";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Router } from  "react-dom"
import Admin from "./Admin";
import User from "./User";
import Quiz from "./Quiz";
import ShowApplications from "./ShowApplicants";
import ApplyJob from "./pages/ApplyJob";
import AddCompany from "./AddCompany";
import CompanyReview from "./CompanyReview";
import ShowReviews from "./ShowReviews";
import Jobrecommendation from "./Jobrecommendation";
import Chatbot from "./Chatbot";
import Careeranalysis from "./Careeranalysis";
function App() {
  return (
    <div style={{ padding: "20px" }}>
      <BrowserRouter>
            <nav>
        <Link to="/">Register</Link>{"     "}
        <Link to="/Login">Login</Link>
      </nav>
   <Routes>
    <Route path="/" element={<Register/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Admin" element={<Admin/>} />
       <Route path="/User" element={<User/>} />
  <Route path="/Applicants/:JobId"  element={<ShowApplications/>}/>

 <Route path="/Apply/:JobId" element={<ApplyJob />} />
<Route path="/quiz/:JobId" element={<Quiz />} />

  <Route  path="/AddCompany" element={<AddCompany/>}/>
<Route  path="/CompanyReview" element={<CompanyReview/>}/>
<Route  path="/ShowReviews/:companyid" element={<ShowReviews/>}/>
  <Route path="/Recommendation" element={<Jobrecommendation/>}/>
  <Route path="/Chatbot" element={<Chatbot/>}/>
 <Route path="/Careeranalysis" element={<Careeranalysis/>}/>

   </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
