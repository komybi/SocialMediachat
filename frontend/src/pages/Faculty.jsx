import React, { useEffect, useState, useRef } from "react";
import {
  MdChat,
  MdPeople,
  MdLibraryBooks,
  MdHome,
  MdVideoLibrary,
  MdArticle,
  MdNotificationsActive,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdAddBox,
  MdMessage,
} from "react-icons/md";
import { PiUserCircleLight } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import UserSearch from "../components/chatComponents/UserSearch";
import MyChat from "../components/chatComponents/MyChat";
import MessageBox from "../components/messageComponents/MessageBox";
import ChatNotSelected from "../components/chatComponents/ChatNotSelected";
import UserSuggestions from "../components/UserSuggestions";
import ResourcesView from "../components/ResourcesView";
import Posts from "./Posts";
import Reels from "./Reels";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import {
  setChatDetailsBox,
  setSocketConnected,
  setUserSearchBox,
  setUserSuggestionsBox,
  setHeaderMenu,
  setProfileDetail,
  setNotificationBox,
} from "../redux/slices/conditionSlice";
import socket from "../socket/socket";
import { addAllMessages, addNewMessage } from "../redux/slices/messageSlice";
import {
  addNewChat,
  addNewMessageRecieved,
  deleteSelectedChat,
} from "../redux/slices/myChatSlice";
import { removeAuth } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { receivedSound } from "../utils/notificationSound";

let selectedChatCompare;

const Faculty = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
  const user = useSelector((store) => store?.auth);
  const newMessageRecieved = useSelector(
    (store) => store?.myChat?.newMessageRecieved
  );
  const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserSearchBox = useSelector(
    (store) => store?.condition?.isUserSearchBox
  );
  const isUserSuggestionsBox = useSelector(
    (store) => store?.condition?.isUserSuggestionsBox
  );
  const authUserId = useSelector((store) => store?.auth?._id);
  const myChats = useSelector((store) => store?.myChat?.chats); // for stats

  const headerUserBox = useRef(null);
  const headerMenuBox = useRef(null);

  // Header menu click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerMenuBox.current &&
        !headerMenuBox.current.contains(event.target) &&
        headerUserBox.current &&
        !headerUserBox.current.contains(event.target)
      ) {
        dispatch(setHeaderMenu(false));
      }
    };

    if (isHeaderMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHeaderMenu, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(removeAuth());
    dispatch(setHeaderMenu(false));
    navigate("/signin");
  };

  // socket connection
  useEffect(() => {
    if (!authUserId) return;
    socket.emit("setup", authUserId);
    socket.on("connected", () => dispatch(setSocketConnected(true)));
  }, [authUserId, dispatch]);

  // socket message received
  useEffect(() => {
    selectedChatCompare = selectedChat;
    const messageHandler = (newMessageReceived) => {
      if (
        selectedChatCompare &&
        selectedChatCompare._id === newMessageReceived.chat._id
      ) {
        dispatch(addNewMessage(newMessageReceived));
      } else {
        receivedSound();
        dispatch(addNewMessageRecieved(newMessageReceived));
      }
    };
    socket.on("message received", messageHandler);

    return () => {
      socket.off("message received", messageHandler);
    };
  });

  // socket clear chat messages
  useEffect(() => {
    const clearChatHandler = (chatId) => {
      if (chatId === selectedChat?._id) {
        dispatch(addAllMessages([]));
        toast.success("Cleared all messages");
      }
    };
    socket.on("clear chat", clearChatHandler);
    return () => {
      socket.off("clear chat", clearChatHandler);
    };
  });

  // socket delete chat messages
  useEffect(() => {
    const deleteChatHandler = (chatId) => {
      dispatch(setChatDetailsBox(false));
      if (selectedChat && chatId === selectedChat._id) {
        dispatch(addAllMessages([]));
      }
      dispatch(deleteSelectedChat(chatId));
      toast.success("Chat deleted successfully");
    };
    socket.on("delete chat", deleteChatHandler);
    return () => {
      socket.off("delete chat", deleteChatHandler);
    };
  });

  // socket chat created
  useEffect(() => {
    const chatCreatedHandler = (chat) => {
      dispatch(addNewChat(chat));
      toast.success("Created & Selected chat");
    };
    socket.on("chat created", chatCreatedHandler);
    return () => {
      socket.off("chat created", chatCreatedHandler);
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/30">
      {/* FACULTY HEADER - Glassmorphism */}
      <div className="w-full h-16 fixed top-0 z-50 md:h-20 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg flex justify-between items-center px-4 md:px-6 font-semibold text-white">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="transition-transform hover:scale-105">
            <img
              src="/logo.jpeg"
              alt="BHULink"
              className="h-12 w-12 rounded-full shadow-md ring-2 ring-amber-400/50"
            />
          </Link>
          <Link to={"/"}>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              BHULink - Faculty
            </span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <button
              className={`relative p-2 rounded-full transition-all duration-300 hover:bg-white/20 ${
                newMessageRecieved.length > 0 ? "animate-pulse" : ""
              }`}
              title={`You have ${newMessageRecieved.length} new notifications`}
              onClick={() => dispatch(setNotificationBox(true))}
            >
              <MdNotificationsActive className="text-2xl text-amber-300" />
              {newMessageRecieved.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {newMessageRecieved.length}
                </span>
              )}
            </button>

            {/* Profile Section */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-white/70">Welcome back,</p>
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
              </div>

              {/* Profile Picture with Dropdown */}
              <div className="relative">
                {/* Profile Picture - Click to upload */}
                <div
                  onClick={() => setShowProfileUpload(true)}
                  className="w-12 h-12 rounded-full border-2 border-amber-400/50 cursor-pointer overflow-hidden hover:border-amber-400 transition-all"
                  title="Click to change profile picture"
                >
                  <img
                    src={
                      user?.image
                        ? (user.image.startsWith('http')
                            ? user.image
                            : `${import.meta.env.VITE_BACKEND_URL}/${user.image}`)
                        : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
                    }}
                  />
                </div>

                {/* Dropdown Menu */}
                <div
                  ref={headerMenuBox}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(setHeaderMenu(!isHeaderMenu));
                  }}
                  className="ml-3 w-8 h-8 rounded-full bg-amber-400/80 hover:bg-amber-400 cursor-pointer flex items-center justify-center transition-all"
                  title="Menu"
                >
                  <MdKeyboardArrowDown 
                    fontSize={16} 
                    className="text-white transition-transform duration-200"
                    style={{
                      transform: isHeaderMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </div>

                {/* Dropdown Content */}
                {isHeaderMenu && (
                  <div
                    className="absolute top-14 right-0 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  >
                    {/* Update Profile Picture */}
                    <div
                      onClick={() => {
                        dispatch(setHeaderMenu(false));
                        setShowProfileUpload(true);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user?.image
                              ? (user.image.startsWith('http')
                                  ? user.image
                                  : `${import.meta.env.VITE_BACKEND_URL}/${user.image}`)
                              : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                          }
                          alt="profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium">Update Profile Picture</span>
                      </div>
                    </div>

                    {/* View Profile */}
                    <div
                      onClick={() => {
                        dispatch(setHeaderMenu(false));
                        dispatch(setProfileDetail());
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border-t border-gray-200"
                    >
                      <PiUserCircleLight className="text-xl text-gray-600" />
                      <span className="font-medium">View Profile</span>
                    </div>

                    {/* Logout */}
                    <div
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border-t border-gray-200"
                    >
                      <IoLogOutOutline className="text-xl text-gray-600" />
                      <span className="font-medium">Logout</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SPACER FOR HEADER */}
      <div className="h-16 md:h-20"></div>

      {/* TAB BAR - Elegant underline style */}
      <div className="flex flex-wrap justify-center gap-1 md:gap-2 px-4 border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-16 md:top-20 z-40">
        {[
          { id: "home", label: "Home", icon: MdHome },
          { id: "posts", label: "Posts", icon: MdArticle },
          { id: "chat", label: "Chat", icon: MdChat },
          { id: "reels", label: "Reels", icon: MdVideoLibrary },
          { id: "resources", label: "Resources", icon: MdLibraryBooks },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm md:text-base font-medium transition-all duration-300 rounded-t-lg ${
              activeTab === tab.id
                ? "text-amber-400 bg-white/10 shadow-inner border-b-2 border-amber-400"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="text-lg" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* HOME TAB - Beautifully redesigned */}
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* Hero welcome card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/60 backdrop-blur-sm border border-white/20 p-6 md:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
              <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  Welcome back, {user?.firstName || "Faculty"}!
                </h1>
                <p className="text-white/70 text-lg max-w-2xl">
                  Stay connected with students, manage resources, and keep up with the latest posts and reels.
                </p>
              </div>
            </div>

            {/* Stats cards with live data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl transition-all hover:scale-105 hover:bg-white/15">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Chats</p>
                    <p className="text-3xl font-bold text-white">{myChats?.length || 0}</p>
                  </div>
                  <div className="bg-amber-400/20 p-3 rounded-full">
                    <MdChat className="text-2xl text-amber-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl transition-all hover:scale-105 hover:bg-white/15">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Unread Messages</p>
                    <p className="text-3xl font-bold text-white">{newMessageRecieved?.length || 0}</p>
                  </div>
                  <div className="bg-red-400/20 p-3 rounded-full">
                    <MdMessage className="text-2xl text-red-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl transition-all hover:scale-105 hover:bg-white/15">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Resources Shared</p>
                    <p className="text-3xl font-bold text-white">24</p>
                  </div>
                  <div className="bg-emerald-400/20 p-3 rounded-full">
                    <MdLibraryBooks className="text-2xl text-emerald-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl transition-all hover:scale-105 hover:bg-white/15">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Active Now</p>
                    <p className="text-3xl font-bold text-white">12</p>
                  </div>
                  <div className="bg-blue-400/20 p-3 rounded-full">
                    <MdPeople className="text-2xl text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions & features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MdAddBox className="text-amber-400" /> Quick Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition"
                  >
                    ✍️ Create Post
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition"
                  >
                    💬 Start Chat
                  </button>
                  <button
                    onClick={() => setActiveTab("resources")}
                    className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition"
                  >
                    📚 Add Resource
                  </button>
                  <button
                    onClick={() => setActiveTab("reels")}
                    className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition"
                  >
                    🎬 Upload Reel
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MdNotificationsActive className="text-amber-400" /> Recent Activity
                </h2>
                <div className="space-y-3 text-white/70">
                  <p className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    New comment on your post
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Student requested resource access
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                    Upcoming webinar tomorrow
                  </p>
                </div>
              </div>
            </div>

            {/* Motivational quote or tip */}
            <div className="text-center py-6 text-white/50 text-sm italic">
              "Empowering education through seamless collaboration."
            </div>
          </div>
        )}

        {/* POSTS TAB */}
        {activeTab === "posts" && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <Posts />
          </div>
        )}

        {/* CHAT TAB - Enhanced container styling */}
        {activeTab === "chat" && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
            <div className="flex flex-wrap w-full min-h-[80vh]">
              {authUserId ? (
                <>
                  <div
                    className={`${
                      selectedChat ? "hidden sm:block" : "block"
                    } w-full sm:w-[40%] lg:w-[35%] border-r border-white/20 bg-black/20`}
                  >
                    <div className="relative h-full">
                      <div className="absolute bottom-4 right-4 flex gap-3 z-10">
                        <button
                          title="Friend Suggestions"
                          onClick={() => dispatch(setUserSuggestionsBox())}
                          className="p-2 bg-amber-500/80 rounded-full shadow-lg hover:scale-110 transition text-white"
                        >
                          <MdPeople size={24} />
                        </button>
                        <button
                          title="New Chat"
                          onClick={() => dispatch(setUserSearchBox())}
                          className="p-2 bg-blue-500/80 rounded-full shadow-lg hover:scale-110 transition text-white"
                        >
                          <MdChat size={24} />
                        </button>
                      </div>
                      {isUserSearchBox ? (
                        <UserSearch />
                      ) : isUserSuggestionsBox ? (
                        <UserSuggestions />
                      ) : (
                        <MyChat />
                      )}
                    </div>
                  </div>
                  <div
                    className={`${
                      !selectedChat ? "hidden sm:block" : "block"
                    } w-full sm:w-[60%] lg:w-[65%] bg-black/20`}
                  >
                    {selectedChat ? (
                      <MessageBox chatId={selectedChat?._id} />
                    ) : (
                      <ChatNotSelected />
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-[80vh] flex items-center justify-center">
                  <div className="text-center text-white bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                    <h2 className="text-3xl mb-4 font-bold">Welcome to BHULink</h2>
                    <p className="mb-6">Please sign in to start chatting and posting.</p>
                    <div className="flex gap-4 justify-center">
                      <Link
                        to="/signin"
                        className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition shadow-lg"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition shadow-lg"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REELS TAB */}
        {activeTab === "reels" && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <Reels />
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === "resources" && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <ResourcesView />
          </div>
        )}

        {/* Profile Picture Upload Modal */}
        {showProfileUpload && (
          <ProfilePictureUpload onClose={() => setShowProfileUpload(false)} />
        )}
      </div>
    </div>
  );
};

export default Faculty;