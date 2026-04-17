import React, { useEffect, useState } from "react";
import { MdChat, MdPeople, MdAnnouncement } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import UserSearch from "../components/chatComponents/UserSearch";
import MyChat from "../components/chatComponents/MyChat";
import MessageBox from "../components/messageComponents/MessageBox";
import ChatNotSelected from "../components/chatComponents/ChatNotSelected";
import UserSuggestions from "../components/UserSuggestions";
import AnnouncementCreate from "../components/AnnouncementCreate";
import {
  setChatDetailsBox,
  setSocketConnected,
  setUserSearchBox,
  setUserSuggestionsBox,
} from "../redux/slices/conditionSlice";
import socket from "../socket/socket";
import { addAllMessages, addNewMessage } from "../redux/slices/messageSlice";
import {
  addNewChat,
  addNewMessageRecieved,
  deleteSelectedChat,
} from "../redux/slices/myChatSlice";
import { toast } from "react-toastify";
import { receivedSound } from "../utils/notificationSound";
let selectedChatCompare;

const Home = () => {
  const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
  const user = useSelector((store) => store?.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserSearchBox = useSelector(
    (store) => store?.condition?.isUserSearchBox
  );
  const isUserSuggestionsBox = useSelector(
    (store) => store?.condition?.isUserSuggestionsBox
  );
  const authUserId = useSelector((store) => store?.auth?._id);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [publicAnnouncements, setPublicAnnouncements] = useState([]);

  // Fetch public announcements
  useEffect(() => {
    const fetchPublicAnnouncements = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/announcement?visibility=public`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setPublicAnnouncements(result.data);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    if (authUserId) {
      fetchPublicAnnouncements();
    }
  }, [authUserId]);

	// socket connection
	useEffect(() => {
		if (!authUserId) return;
		socket.emit("setup", authUserId);
		socket.on("connected", () => dispatch(setSocketConnected(true)));
	}, [authUserId]);

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
		<div className="w-full">
			{authUserId ? (
				<>
					{/* Public Announcements Section */}
					{publicAnnouncements.length > 0 && (
						<div className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 shadow-lg">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<MdAnnouncement className="text-amber-600" />
									Public Announcements ({publicAnnouncements.length})
								</h3>
								<button
									onClick={() => setShowAnnouncementModal(true)}
									className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition text-sm"
								>
									Create
								</button>
							</div>
							<div className="space-y-2 max-h-40 overflow-y-auto">
								{publicAnnouncements.map((announcement) => (
									<div key={announcement._id} className="bg-white rounded-md p-3 border border-amber-100">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h4 className="font-medium text-gray-800 text-sm mb-1">{announcement.title}</h4>
												<p className="text-gray-600 text-xs line-clamp-2">{announcement.content}</p>
												<div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
													<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
														announcement.priority === 'high' ? 'bg-red-100 text-red-600' :
														announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
														'bg-green-100 text-green-600'
													}`}>
														{announcement.priority.toUpperCase()}
													</span>
													<span>By {announcement.author?.firstName} {announcement.author?.lastName}</span>
													<span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					
					<div className="flex w-full border-slate-500 border rounded-sm shadow-md shadow-black relative">
						<div
							className={`${
									selectedChat && "hidden"
								} sm:block sm:w-[40%] w-full h-[80vh] bg-black/40 border-r border-slate-500 relative`}
						>
							<div className="absolute bottom-3 right-6 cursor-pointer text-white flex space-x-2">
								<MdPeople
									title="Friend Suggestions"
									fontSize={32}
									onClick={() => dispatch(setUserSuggestionsBox())}
								/>
								<MdChat
									title="New Chat"
									fontSize={32}
									onClick={() => dispatch(setUserSearchBox())}
								/>
							</div>
							{isUserSearchBox ? <UserSearch /> : isUserSuggestionsBox ? <UserSuggestions /> : <MyChat />}
						</div>
						<div
							className={`${
									!selectedChat && "hidden"
								} sm:block sm:w-[60%] w-full h-[80vh] bg-black/40 relative overflow-hidden`}
						>
							{selectedChat ? (
									<MessageBox chatId={selectedChat?._id} />
								) : (
									<ChatNotSelected />
								)}
						</div>
					</div>
				</>
			) : (
				<div className="w-full h-[80vh] bg-black/40 flex items-center justify-center">
					<div className="text-center text-white">
						<h2 className="text-2xl mb-4">Welcome to BHULink</h2>
						<p className="mb-4">Please sign in to start chatting and posting.</p>
						<Link to="/signin" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
							Sign In
						</Link>
						<Link to="/signup" className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
							Sign Up
						</Link>
					</div>
				</div>
			)}
			
			{/* Announcement Modal */}
			{showAnnouncementModal && (
				<AnnouncementCreate
					onClose={() => setShowAnnouncementModal(false)}
					onAnnouncementCreated={(newAnnouncement) => {
						setPublicAnnouncements(prev => [newAnnouncement, ...prev]);
						toast.success("Announcement created successfully!");
					}}
				/>
			)}
		</div>
	);
};

export default Home;
