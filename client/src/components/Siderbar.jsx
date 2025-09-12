import React, { useContext, useState, useEffect } from "react";
import assets from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../../context/Authcontext";
import { ChatContext } from "../../context/ChatContext";
const Siderbar = () => {
  const {
    getUsers,
    users,
    selecteduser,
    setSelecteduser,
    unseenmessages,
    setUnseenmessages,
  } = useContext(ChatContext);
  const { logout, onlineusers } = useContext(Authcontext);

  const [input, setinput] = useState(false);

  const navigate = useNavigate();

  const filteredusers = input
    ? users.filter((user) =>
        user.username.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineusers]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selecteduser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="logo"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute right-0 top-full z-20 w-32  bg-[#282142] rounded-md group-hover:block p-5 border border-gray-600 text-gray-100 hidden">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            onChange={(e) => setinput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="search user..."
          />
        </div>
      </div>
      <div className="flex flex-col">
        {filteredusers.map((user, index) => (
          <div
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selecteduser?._id === user._id ? "bg-[#282142]/50" : ""
            } hover:bg-[#4A47A3]/50`}
            key={index}
            onClick={() => {
              setSelecteduser(user);
              setUnseenmessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p className="text-sm font-semibold">{user.username}</p>
              {onlineusers.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {(unseenmessages?.[user._id] ?? 0) > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center rounded-full bg-violet-500/50">
                {unseenmessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Siderbar;
