import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addFollowing, removeFollowing } from "../redux/slices/authSlice";

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
			}
		} catch (error) {
			console.error("Error unfollowing user:", error);
			toast.error("Error unfollowing user");
		}
	};

	if (loading) {
		return <div className="text-center py-4">Loading users...</div>;
	}

	return (
		<div className="p-4">
			<h2 className="text-xl font-semibold mb-4">Friend Suggestions</h2>
			<div className="space-y-2">
				{users.map((user) => (
					<div key={user._id} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
						<div className="flex items-center">
							<img
								src={user.image}
								alt={user.firstName}
								className="w-10 h-10 rounded-full mr-3"
							/>
							<div>
								<p className="font-medium">{user.firstName} {user.lastName}</p>
								<p className="text-sm text-gray-500">{user.email}</p>
							</div>
						</div>
						{authUser.following && authUser.following.includes(user._id) ? (
							<button
								onClick={() => handleUnfollow(user._id)}
								className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
							>
								Unfollow
							</button>
						) : (
							<button
								onClick={() => handleFollow(user._id)}
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
							>
								Follow
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default UserSuggestions;