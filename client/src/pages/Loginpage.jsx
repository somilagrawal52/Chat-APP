import React,{useState,useContext} from 'react'
import assets from '../assets/assets'
import {Authcontext} from '../../context/Authcontext'
const Loginpage = () => {

  const [currState,setCurrState]=useState("Sign Up")
  const [fullName,setFullname]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [bio,setBio]=useState("")
  const [isDatasubmitted,setisDatasubmitted]=useState(false);

  const {login}=useContext(Authcontext)

  const onSubmitHandler=(e)=>{
    e.preventDefault();
    
    // Handle first step of signup
    if(currState==="Sign Up" && !isDatasubmitted){
      if(!fullName || !email || !password) {
        alert("Please fill all required fields");
        return;
      }
      setisDatasubmitted(true);
      return;
    }

    const state = currState === "Sign Up" ? "signup" : "signin";
    
    // For signup, ensure all fields including bio are present
    if(state === "signup") {
      if(!fullName || !email || !password || !bio) {
        alert("Please fill all required fields");
        return;
      }
      login(state, {
        username: fullName,
        email,
        password,
        bio
      });
    } else {
      // For signin, only email and password needed
      if(!email || !password) {
        alert("Please fill all required fields");
        return;
      }
      login(state, { email, password });
    }
  }
  return (
    <div className='min-h-screen flex justify-center items-center bg-cover bg-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left side */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]'/>

      {/* right side */}
      <form onSubmit={onSubmitHandler} action="" className='flex flex-col gap-6 bg-white/8 backdrop-blur-lg p-6 rounded-lg shadow-lg border-2 text-white border-gray-500'>
        <h2 className='flex justify-between items-center font-medium text-2xl'>{currState}
          {isDatasubmitted && <img onClick={()=>setisDatasubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>}
        </h2>
        {currState==="Sign Up" && !isDatasubmitted && (
          <input onChange={(e)=>setFullname(e.target.value)} value={fullName} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required/>
        )}

        {!isDatasubmitted &&(
          <>
          <input  onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required/>
           <input  onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required/>
          </>
        )}
        {
          currState==="Sign Up" && isDatasubmitted && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} cols="30" rows="4" placeholder='provide a short bio...' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required></textarea>
          )
        }
        <button type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState==="Sign Up"?"Create Account":"Login Now"}
        </button>

        <div className='flex flex-col gap-2'>
          {currState==="Sign Up"?(
            <p onClick={()=>{setCurrState("Login"); setisDatasubmitted(false)}} className='text-sm text-gray-600'>Already have an account? <span className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
          ):(
            <p onClick={()=>{setCurrState("Sign Up"); setisDatasubmitted(false)}} className='text-sm text-gray-600'>Create an account <span className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Loginpage
