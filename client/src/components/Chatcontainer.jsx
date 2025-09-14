import React, { useRef, useEffect, useContext, useState } from "react";
import assets from "../assets/assets.js";
import { formatMessageTime } from "../lib/util.js";
import { ChatContext } from "../../context/ChatContext";
import { Authcontext } from "../../context/Authcontext";
import toast from "react-hot-toast";

const Chatcontainer = () => {
  const { messages, selecteduser, setSelecteduser, sendMessages, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineusers,axios } = useContext(Authcontext);

  const scrollEnd = useRef();

  const [input, setInput] = useState("");
  const [smartReplies, setSmartReplies] = useState([]);

  //function to fetch smart replies
  const fetchSmartReplies = async (message) => {
  try {
    const { data } = await axios.post(`/message/smart-replies`, { msg:message });
    if (data.success) {
      // Instead of appending as a message, treat Gemini reply as suggestions
      setSmartReplies(data.replies); // assuming backend sends suggestions separated by "|"
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  //handle sending a message
  const handlesendMessages = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessages({ text: input.trim() });
    setInput("");
  };

  //handle sending a image
  const handlesendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;
    }
    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessages({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selecteduser) {
      getMessages(selecteduser._id);
    }
  }, [selecteduser]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender !== authUser._id) {
        fetchSmartReplies(lastMsg.text);
      } else {
        setSmartReplies([]); // clear replies when you send
      }
    }
  }, [messages]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return selecteduser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* chat header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selecteduser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selecteduser.username}
          {onlineusers.includes(selecteduser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelecteduser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>
      {/* chat messages */}
      <div className="flex flex-col h-[calc(100%-120px)] p-3 overflow-y-scroll pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 mb-4 ${
              msg.sender === authUser._id ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar + time (LEFT) */}
            {msg.sender !== authUser._id && (
              <div className="text-center text-xs">
                <img
                  src={selecteduser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            )}

            {/* Message bubble */}
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${
                  msg.sender === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}

            {/* Avatar + time (RIGHT) */}
            {msg.sender === authUser._id && (
              <div className="text-center text-xs">
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            )}
          </div>
        ))}

        <div ref={scrollEnd}></div>
      </div>

     {/* smart replies part */}
{smartReplies.length > 0 && (
  <div className="absolute bottom-16 left-0 right-0 px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
    {smartReplies.map((reply, idx) => (
      <button
        key={idx}
        onClick={() => {
          sendMessages({ text: reply });
          setSmartReplies([]); // clear after sending
        }}
        className="px-4 py-1 rounded-full bg-violet-600 text-white text-sm hover:bg-violet-700 transition whitespace-nowrap"
      >
        {reply}
      </button>
    ))}
  </div>
)}

      {/* bottom area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 w-full p-3 backdrop-blur-lg">
        <div className="flex items-center flex-1 bg-white/10 backdrop-blur-lg rounded-full px-3 py-2">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) =>
              e.key === "Enter" ? handlesendMessages(e) : null
            }
            type="text"
            placeholder="Type your message here..."
            className="bg-transparent border-none outline-none text-white w-full"
          />
          <input
            onChange={handlesendImage}
            type="file"
            id="image"
            accept="image/png, image/jpg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handlesendMessages}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-whute/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat Anytime,Anywhere</p>
    </div>
  );
};

export default Chatcontainer;
