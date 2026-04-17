const Announcement = require("../models/Announcement");
const wrapAsync = require("../middlewares/wrapAsync");

// Get all announcements (filtered by user role and visibility)
const getAllAnnouncements = async (req, res) => {
  try {
    const { type, visibility } = req.query;
    const userRole = req.user.role;
    
    let filter = { isActive: true };
    
    // Filter by visibility
    if (visibility === 'public') {
      filter.visibility = 'public';
    } else if (visibility === 'private') {
      filter.visibility = 'private';
    }
    
    // Filter by type if specified
    if (type) {
      filter.type = type;
    }
    
    // Filter by target audience based on user role
    if (userRole !== 'admin' && userRole !== 'faculty') {
      filter.$or = [
        { targetAudience: 'all' },
        { targetAudience: userRole }
      ];
    }
    
    const announcements = await Announcement.find(filter)
      .populate('author', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: announcements,
      count: announcements.length
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching announcements"
    });
  }
};

// Create new announcement
const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      visibility,
      targetAudience,
      jobDetails,
      priority,
      expiresAt
    } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }
    
    // Only faculty and admin can create announcements
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only faculty and admin can create announcements"
      });
    }
    
    // Handle file attachments if any
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date()
      }));
    }
    
    const announcementData = {
      title,
      content,
      type: type || 'general',
      visibility: visibility || 'private',
      targetAudience: targetAudience || ['all'],
      author: req.user._id,
      priority: priority || 'medium',
      attachments,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    };
    
    // Add job details if type is job
    if (type === 'job' && jobDetails) {
      announcementData.jobDetails = jobDetails;
    }
    
    const announcement = new Announcement(announcementData);
    await announcement.save();
    
    // Populate author details
    await announcement.populate('author', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Error creating announcement"
    });
  }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const announcement = await Announcement.findById(id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }
    
    // Check if user is the author or admin
    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this announcement"
      });
    }
    
    // Update announcement
    Object.assign(announcement, updateData);
    await announcement.save();
    
    await announcement.populate('author', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Error updating announcement"
    });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = await Announcement.findById(id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }
    
    // Check if user is the author or admin
    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this announcement"
      });
    }
    
    await Announcement.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting announcement"
    });
  }
};

// Get single announcement
const getAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = await Announcement.findById(id)
      .populate('author', 'firstName lastName email');
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching announcement"
    });
  }
};

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncement
};
