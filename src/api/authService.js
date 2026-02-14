
import axios from "axios";

const BASE_URL = "https://localhost:7177";


const api=axios.create({
  baseURL:BASE_URL,
  headers:{
    "Content-Type":"application/json"
  }
});





export const registerUser=async(email,password)=>{
  try{
 await api.post("/register",{email,password});
 return;
  }
  catch(error){
    throw new Error(
      error.response?.data||"Registration failed"
    );
  }
};




export const loginUser=async(email,password)=>{
  try{
  const res=await api.post("/login",{email,password});
 return res.data;
  }
  catch(error){
    throw new Error(
      error.response?.data||"Login failed"
    )
  }
}