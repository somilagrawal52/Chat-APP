import React,{useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets.js'
import {Authcontext} from '../../context/Authcontext'
const Profile = () => {
  const {authUser,updateprofile} = useContext(Authcontext);
  const [selectedImg,setselectedImg]=useState(null);
  const navigate=useNavigate(); 
  const [name,setname]=useState(authUser.username);
  const [bio,setbio]=useState(authUser.bio);

  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateprofile({username:name,bio});
      navigate('/');
      return;
    }
    const reader=new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload=async () => {
      const base64Image=reader.result;
      await updateprofile({profilePic:base64Image,username:name,bio});
      navigate('/');
    }
    
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-cover bg-no-repeat'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1' action="">
          <h1 className='text-lg'>Profile details</h1>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
          <input onChange={(e)=>setselectedImg(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden/>
          <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
          Upload profile image
          </label>
          <input onChange={(e)=>setname(e.target.value)} value={name} type="text" required placeholder='Your Name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
          <textarea required placeholder='Your Bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4} value={bio} onChange={(e)=>setbio(e.target.value)}></textarea>
          <button type='submit' className='bg-violet-500 text-white p-2 rounded-full text-lg cursor-pointer'>Save Changes</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default Profile
