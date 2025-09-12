import {createContext, useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import {io} from 'socket.io-client'
import  toast  from 'react-hot-toast';

const backendURL=import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL=backendURL;

const Authcontext=createContext();

const AuthProvider=({children})=>{

    const [token,setToken]=useState(localStorage.getItem('token'));
    const [authUser,setauthUser]=useState(null);
    const [onlineusers,setOnlineusers]=useState([]);
    const [socket,setSocket]=useState(null);
    const [loading, setLoading] = useState(true); // new

    const checkAuth = useCallback(async () => {
        if (!token) {
            setauthUser(null);
            setLoading(false);
            return;
        }
        try {
            const {data}=await axios.get("/status");
            if(data.success){
            setauthUser(data.user);
            connectSocket(data.user);
        }else {
                setauthUser(null);
            }
        } catch (error) {
            toast.error(error.message);
            setauthUser(null); // important!
        }finally {
            setLoading(false);
        }
    },[token])

    //login function to handle user authentication and socket connection

    const login=async (state,credentials)=> {
        try {
            console.log('Sending request:', state, credentials);
            const {data}=await axios.post(`/${state}`,credentials);
            console.log('Response:', data);

            if(data.success){
                setauthUser(data.user);
                connectSocket(data.user);
                axios.defaults.headers.common["Authorization"]=`Bearer ${data.token}`;
                setToken(data.token);
                localStorage.setItem('token',data.token);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            if (error.response?.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred. Please try again.');
            }
        }
    }

    //logout function to handle user logout and socket disconnection

    const logout=async () => {
    localStorage.removeItem('token');
    setToken(null);
    setauthUser(null);
    setOnlineusers([]);
    axios.defaults.headers.common["Authorization"] = null;

    if(socket) socket.disconnect();

    toast.success("Logged out successfully");
    }

    //update profile function to handle user profile update

    const updateprofile=async (body) => {
        try {
            const {data}=await axios.put("/update",body);

            if(data.success){
                setauthUser(data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //connect socket function to handle socket connection and online users update

    const connectSocket=(userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket=io(backendURL,{
            query:{userId:userData._id}
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getonlineusers",(userIds)=>{
            setOnlineusers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["Authorization"]=`Bearer ${token}`;
            checkAuth();
        }
    },[token, checkAuth]);

    const value={
        axios,
        authUser,
        onlineusers,
        socket,
        login,
        logout,
        updateprofile,
    }
    // if (loading) return null;
    return (
        <Authcontext.Provider value={value}>
            {children}
        </Authcontext.Provider>
    )
}

export {Authcontext,AuthProvider};