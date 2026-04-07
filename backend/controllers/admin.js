const Post = require("../models/post");
const Reel = require("../models/reel");
const User = require("../models/user");
const Resource = require("../models/resource");
const Chat = require("../models/chat");

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

module.exports = {
  getPlatformStats,
  getReportedContent,
  dismissReport
};
