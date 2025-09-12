import {createContext,useState,useContext,useEffect} from 'react';
import {Authcontext} from './Authcontext'
import toast from 'react-hot-toast'

export const ChatContext=createContext();

export const ChatProvider=({children})=>{

    const [messages,setMessages]=useState([]);
    const [users,setusers]=useState([]);
    const [selecteduser,setSelecteduser]=useState(null);
    const [unseenmessages,setUnseenmessages]=useState({});

    const {socket,axios}=useContext(Authcontext);

    //function to get all users
    const getUsers=async () => {
        try {
           const{data}= await axios.get(`/message/users`);
           if(data.success){
            setusers(data.users);
            setUnseenmessages(data.unseenMessagesCount);
           }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to get messages for selected user
    const getMessages=async (userId) => {
        try {
            const {data}=await axios.get(`/message/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to send messages to selected user
    const sendMessages=async (messageData) => {
        try {
            if (!selecteduser?._id) {
      toast.error("No user selected");
      return;
    }
            const {data}=await axios.post(`/message/send/${selecteduser._id}`,messageData)
            if(data.success){
                setMessages((prev)=>[...prev,data.newMessage])
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to get new messages in real time
    const subscribeTomessages=async () => {
        if(!socket) return;

        socket.on("newMessage",(newMessage)=>{
            if(selecteduser && String(newMessage.sender)===String(selecteduser._id)){
                newMessage.seen=true;
                setMessages((prev)=>[...prev,newMessage]);
                axios.put(`/message/messages/seen/${newMessage._id}`);
            }
            else{
                setUnseenmessages((prev)=>({
                    ...prev,[newMessage.sender]:
                    prev[newMessage.sender]?prev[newMessage.sender]+1:1
                }))
            }
        })
    }

    //function to unsubscribe from messages
    const unsubscribefromMessages=() => {
        if(socket) socket.off("newMessage")
    }

    useEffect(() => {
      
        subscribeTomessages();
      return () => unsubscribefromMessages();
    }, [socket,selecteduser])
    

    const value={
        messages,users,selecteduser,getUsers,setMessages,sendMessages,setSelecteduser,unseenmessages,setUnseenmessages,getMessages
    }

    return( <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
        )
}