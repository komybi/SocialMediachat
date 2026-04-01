import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";

const Posts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const authUser = useSelector((store) => store?.auth);

	const fetchPosts = async () => {
		setLoading(true);
		try {
			const response = await fetch(`http://localhost:9001/api/post`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const json = await response.json();
			if (json.data) {
				setPosts(json.data);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (authUser) {
			fetchPosts();
		}
	}, [authUser]);

	const addPost = (newPost) => {
		setPosts([newPost, ...posts]);
	};

	const updatePost = (updatedPost) => {
		setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
	};

	if (!authUser) {
		return (
			<div className="max-w-2xl mx-auto p-4 text-center">
				<h2 className="text-2xl mb-4">Welcome to Posts</h2>
				<p className="mb-4">Please sign in to view and create posts.</p>
				<Link to="/signin" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
					Sign In
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-4">
			<CreatePost onPostCreated={addPost} />
			<PostList posts={posts} loading={loading} onPostUpdate={updatePost} />
		</div>
	);
};

export default Posts;