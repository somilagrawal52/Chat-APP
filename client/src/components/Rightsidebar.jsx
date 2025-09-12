import React,{useContext,useState,useEffect} from 'react'
import assets,{imagesDummyData} from '../assets/assets'
import {ChatContext} from '../../context/ChatContext'
import {Authcontext} from '../../context/Authcontext'

const Rightsidebar = () => {

  const {selecteduser,messages}=useContext(ChatContext)
  const {logout,onlineusers}=useContext(Authcontext)
  const [msgImages,setmsgimages]=useState([])

  //get all images from the messages
  useEffect(() => {
    setmsgimages(messages.filter(msg=>msg.image).map(msg=>msg.image))
  }, [messages])
  
  return selecteduser && (
    <div className={`bg-[#8185B2]/10 text-white h-full min-w-[200px] relative overflow-y-scroll ${selecteduser?'max-md:hidden':''}`}>

        <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img src={selecteduser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full'/>
          <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
            {onlineusers.includes(selecteduser._id)&&<p className='w-2 h-2 rounded-full bg-green-500'></p>}
            {selecteduser.username || 'Unknown User'}</h1>
            <p className='mx-auto px-10'>{selecteduser.bio}</p>
        </div>
        <hr className='border-[#ffffff50] my-4' />
        <div className='px-5 text-xs'>
            <p>Media</p>
            <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
              {msgImages.map((url,index)=>(
                <div onClick={()=>window.open(url)} key={index} className='curosor-pointer rounded'>
                  <img src={url} alt="" className='h-full rounded-md'/>
                </div>
              ))}
            </div>
        </div>
        <button onClick={()=>logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 text-sm font-light to-violet-600 border-none text-white px-20 py-2 rounded-full cursor-pointer'>
          Logout
        </button>
    </div>
  )
}

export default Rightsidebar
