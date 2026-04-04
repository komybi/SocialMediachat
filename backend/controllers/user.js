const User = require("../models/user");

const getAuthUser = async (req, res) => {
	if (!req.user) {
		return res.status(404).json({ message: `User Not Found` });
	}
	res.status(200).json({
		data: req.user,
	});
};

const getAllUsers = async (req, res) => {
	const allUsers = await User.find({ _id: { $ne: req.user._id } })
		.select("-password")
		.sort({ _id: -1 });
	res.status(200).send({ data: allUsers });
};

const followUser = async (req, res) => {
	const { userId } = req.params;
	const currentUser = req.user;

	if (currentUser.following.includes(userId)) {
		return res.status(400).json({ message: "Already following" });
	}

	currentUser.following.push(userId);
	await currentUser.save();

	res.status(200).json({ message: "Followed successfully" });
};

const unfollowUser = async (req, res) => {
	const { userId } = req.params;
	const currentUser = req.user;

	currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
	await currentUser.save();

	res.status(200).json({ message: "Unfollowed successfully" });
};

const updateProfilePicture = async (req, res) => {
	try {
		const currentUser = req.user;

		if (!req.file) {
			return res.status(400).json({ message: "No image file provided" });
		}

		// Update user's image field with the uploaded file path
		currentUser.image = req.file.path;
		await currentUser.save();

		res.status(200).json({
			message: "Profile picture updated successfully",
			data: currentUser
		});
	} catch (error) {
		console.error("Error updating profile picture:", error);
		res.status(500).json({ message: "Error updating profile picture" });
	}
};

module.exports = { getAuthUser, getAllUsers, followUser, unfollowUser, updateProfilePicture };
