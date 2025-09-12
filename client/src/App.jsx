import React,{useContext,useEffect} from 'react'
import { Routes,Route,Navigate,useNavigate } from 'react-router-dom'
import Homepage from './pages/homepage.jsx'
import Loginpage from './pages/Loginpage.jsx'
import Profile from './pages/Profile.jsx'
import {Toaster} from 'react-hot-toast'
import {Authcontext} from '../context/authcontext.jsx'
const App = () => {
  const {authUser}=useContext(Authcontext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
    }
  }, [authUser, navigate]);
  return (
    <div className="bg-[url('/bgImage.svg')] bg-no-repeat bg-cover min-h-screen">
      <Toaster />
      <Routes>
      <Route path='/' element={authUser?<Homepage />:<Navigate to="/login"/>} />
      <Route path='/login' element={!authUser?<Loginpage />:<Navigate to="/"/>} />
      <Route path='/profile' element={authUser?<Profile />:<Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
