import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addFollowing, removeFollowing } from "../redux/slices/authSlice";
import { addNewChat, addSelectedChat } from "../redux/slices/myChatSlice";

const UserSuggestions = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const authUser = useSelector((store) => store?.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const json = await response.json();
			if (json.data) {
				setUsers(json.data);
			}
		} catch (error) {
			console.error("Error fetching users:", error);
			toast.error("Could not load users");
		}
		setLoading(false);
	};

	const handleFollow = async (userId) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/follow/${userId}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const json = await response.json();
			if (json.message) {
				toast.success(json.message);
				dispatch(addFollowing(userId));
				fetchUsers();
			}
		} catch (error) {
			console.error("Error following user:", error);
			toast.error("Error following user");
		}
	};

	const handleUnfollow = async (userId) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/unfollow/${userId}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const json = await response.json();
			if (json.message) {
				toast.success(json.message);
				dispatch(removeFollowing(userId));
				fetchUsers();
			}
		} catch (error) {
			console.error("Error unfollowing user:", error);
			toast.error("Error unfollowing user");
		}
	};

	const handleChat = async (userId) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({ userId }),
			});
			const json = await response.json();
			if (json.data) {
				dispatch(addNewChat(json.data));
				dispatch(addSelectedChat(json.data));
				toast.success("Chat opened");
			}
		} catch (error) {
			console.error("Error creating chat:", error);
			toast.error("Error opening chat");
		}
	};

	if (loading) {
		return <div className="text-center py-4">Loading users...</div>;
	}

	return (
		<div className="p-4 h-full flex flex-col">
			<h2 className="text-xl font-semibold mb-4 text-white">Friend Suggestions</h2>
			<div className="flex-1 overflow-y-auto space-y-2 max-h-[60vh] pr-2 custom-scrollbar">
				{users.map((user) => (
					<div key={user._id} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
						<div className="flex items-center">
							<img
								src={user.image}
								alt={user.firstName}
								className="w-10 h-10 rounded-full mr-3"
							/>
							<div>
								<p className="font-medium text-white">{user.firstName} {user.lastName}</p>
								<p className="text-sm text-gray-300">{user.email}</p>
							</div>
						</div>
						<div className="flex gap-1">
							{authUser.following && authUser.following.includes(user._id) ? (
								<button
									onClick={() => handleUnfollow(user._id)}
									className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
								>
									Unfollow
								</button>
							) : (
								<button
									onClick={() => handleFollow(user._id)}
									className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
								>
									Follow
								</button>
							)}
							<button
								onClick={() => handleChat(user._id)}
								className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
							>
								Chat
							</button>
						</div>
					</div>
				))}
			</div>
			{users.length === 0 && (
				<div className="text-center py-8 text-white">
					<p>No users found</p>
				</div>
			)}
		</div>
	);
};

export default UserSuggestions;
