const Post = require("../models/post");
const Reel = require("../models/reel");
const User = require("../models/user");
const Resource = require("../models/resource");
const Chat = require("../models/chat");
const Message = require("../models/message");
const Announcement = require("../models/Announcement");

const getPlatformStats = async (req, res) => {
  try {
    // Count users by role
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const totalUsers = totalStudents + totalFaculty;

    // Count content
    const totalPosts = await Post.countDocuments();
    const totalReels = await Reel.countDocuments();
    const totalResources = await Resource.countDocuments();
    const totalChats = await Chat.countDocuments();

    // Count reported content (assuming reports are stored in posts/reels)
    const reportedPosts = await Post.countDocuments({ reports: { $gt: 0 } });
    const reportedReels = await Reel.countDocuments({ reports: { $gt: 0 } });

    // Get active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({ 
      lastLogin: { $gte: thirtyDaysAgo } 
    });

    const stats = {
      totalUsers,
      totalStudents,
      totalFaculty,
      totalPosts,
      totalReels,
      totalResources,
      totalChats,
      reportedPosts,
      reportedReels,
      activeUsers
    };

    res.status(200).json({
      message: "Platform statistics retrieved successfully",
      data: stats
    });
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    res.status(500).json({ 
      message: "Error fetching platform statistics" 
    });
  }
};

const getReportedContent = async (req, res) => {
  try {
    // Get reported posts
    const reportedPosts = await Post.find({ reports: { $gt: 0 } })
      .populate('author', 'firstName lastName')
      .sort({ reports: -1 });

    // Get reported reels
    const reportedReels = await Reel.find({ reports: { $gt: 0 } })
      .populate('author', 'firstName lastName')
      .sort({ reports: -1 });

    res.status(200).json({
      message: "Reported content retrieved successfully",
      data: {
        posts: reportedPosts,
        reels: reportedReels
      }
    });
  } catch (error) {
    console.error("Error fetching reported content:", error);
    res.status(500).json({ 
      message: "Error fetching reported content" 
    });
  }
};

const dismissReport = async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let updatedContent;
    
    if (type === 'post') {
      updatedContent = await Post.findByIdAndUpdate(
        id, 
        { $set: { reports: 0 } },
        { new: true }
      );
    } else if (type === 'reel') {
      updatedContent = await Reel.findByIdAndUpdate(
        id, 
        { $set: { reports: 0 } },
        { new: true }
      );
    } else {
      return res.status(400).json({ message: "Invalid content type" });
    }

    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json({
      message: `Report dismissed from ${type}`,
      data: updatedContent
    });
  } catch (error) {
    console.error("Error dismissing report:", error);
    res.status(500).json({ 
      message: "Error dismissing report" 
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log('Admin API called by user:', req.user?.email, 'Role:', req.user?.role);
    
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log('Found users:', users.length);
    
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ 
      message: "Error fetching users" 
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'firstName lastName email image')
      .populate('likes', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      message: "Posts retrieved successfully",
      data: posts
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ 
      message: "Error fetching posts" 
    });
  }
};

const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find({})
      .populate('author', 'firstName lastName email image')
      .populate('likes', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      message: "Reels retrieved successfully",
      data: reels
    });
  } catch (error) {
    console.error("Error fetching reels:", error);
    res.status(500).json({ 
      message: "Error fetching reels" 
    });
  }
};

const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find({})
      .populate('facultyId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      message: "Resources retrieved successfully",
      data: resources
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ 
      message: "Error fetching resources" 
    });
  }
};

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({})
      .populate('users', 'firstName lastName email image')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });
    
    // Also get message counts for each chat
    const chatsWithCounts = await Promise.all(
      chats.map(async (chat) => {
        const messageCount = await Message.countDocuments({ chat: chat._id });
        return {
          ...chat.toObject(),
          messageCount
        };
      })
    );
    
    res.status(200).json({
      message: "Chats retrieved successfully",
      data: chatsWithCounts
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ 
      message: "Error fetching chats" 
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete user's posts
    await Post.deleteMany({ author: id });
    
    // Delete user's reels
    await Reel.deleteMany({ author: id });
    
    // Remove user from chats
    await Chat.updateMany(
      { users: id },
      { $pull: { users: id } }
    );
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.status(200).json({
      message: "User and all associated data deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      message: "Error deleting user" 
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.status(200).json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ 
      message: "Error deleting post" 
    });
  }
};

const deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reel = await Reel.findByIdAndDelete(id);
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }
    
    res.status(200).json({
      message: "Reel deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting reel:", error);
    res.status(500).json({ 
      message: "Error deleting reel" 
    });
  }
};

module.exports = {
  getPlatformStats,
  getReportedContent,
  dismissReport,
  getAllUsers,
  getAllPosts,
  getAllReels,
  getAllResources,
  getAllChats,
  deleteUser,
  deletePost,
  deleteReel
};
