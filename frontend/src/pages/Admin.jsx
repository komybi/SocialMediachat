// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  MdDashboard, 
  MdPeople, 
  MdSchool, 
  MdLibraryBooks, 
  MdDelete, 
  MdRefresh,
  MdArticle,
  MdVideoLibrary,
  MdMessage,
  MdLogout,
  MdReport,
  MdTrendingUp,
  MdNotifications,
  MdVisibility,
  MdAnnouncement,
  MdAdd,
  MdClose,
  MdSave
} from 'react-icons/md';
import { getResources, deleteResource } from '../services/resourceService';
import { useDispatch, useSelector } from 'react-redux';
import { removeAuth } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AnnouncementCreate from '../components/AnnouncementCreate';

const Admin = () => {
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
    isActive: true
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [stats, setStats] = useState({
    totalResources: 0,
    totalFaculty: 0,
    totalStudents: 0,
    totalPosts: 0,
    totalReels: 0,
    totalChats: 0,
    reportedPosts: 0,
    reportedReels: 0,
    activeUsers: 0
  });
  const [reports, setReports] = useState({
    posts: [],
    reels: []
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store?.auth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(removeAuth());
    navigate("/signin");
    toast.success("Logged out successfully");
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch real statistics from backend
      const statsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const statsData = await statsResponse.json();
      
      if (statsResponse.ok) {
        // Fetch reported content
        const reportsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/reports`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const reportsData = await reportsResponse.json();
        
        if (reportsResponse.ok) {
          setStats(statsData.data);
          setReports({
            posts: reportsData.data.posts.map(post => ({
              id: post._id,
              title: post.content.substring(0, 50) + '...',
              author: post.user?.firstName + ' ' + post.user?.lastName || 'Unknown',
              reports: post.reports
            })),
            reels: reportsData.data.reels.map(reel => ({
              id: reel._id,
              title: reel.content.substring(0, 50) + '...',
              author: reel.user?.firstName + ' ' + reel.user?.lastName || 'Unknown',
              reports: reel.reports
            }))
          });
        }
      } else {
        throw new Error(statsData.message);
      }
      
      // Load resources (existing logic)
      const allResources = getResources();
      setResources(allResources);
      
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load statistics');
      
      // Fallback to mock data if API fails
      const allResources = getResources();
      const uniqueFaculty = new Set(allResources.map((r) => r.facultyId));
      
      setStats({
        totalResources: allResources.length,
        totalFaculty: uniqueFaculty.size,
        totalStudents: 12580,
        totalPosts: 2,
        totalReels: 2,
        totalChats: 3420,
        reportedPosts: 1,
        reportedReels: 1,
        activeUsers: 8920
      });
      
      setResources(allResources);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/announcement`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setAnnouncements(result.data);
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  
  const loadPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const loadReels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/reels`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setReels(result.data);
      }
    } catch (error) {
      console.error('Error loading reels:', error);
      toast.error('Failed to load reels');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Post deleted successfully');
        loadPosts();
      } else {
        toast.error(result.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleDeleteReel = async (reelId) => {
    if (!window.confirm('Are you sure you want to delete this reel? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/reels/${reelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Reel deleted successfully');
        loadReels();
      } else {
        toast.error(result.message || 'Failed to delete reel');
      }
    } catch (error) {
      console.error('Error deleting reel:', error);
      toast.error('Failed to delete reel');
    }
  };

  const handleViewContent = (content, type) => {
    setSelectedContent({ ...content, type });
    setShowContentModal(true);
  };

  // User management functions
  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Authentication required');
        return;
      }

      console.log('Loading users from admin API...');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('Users loaded successfully:', result.data?.length || 0);
        setUsers(result.data || []);
      } else {
        console.error('API Error:', result.message);
        toast.error(result.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userFormData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('User created successfully');
        setShowUserModal(false);
        resetUserForm();
        loadUsers();
      } else {
        toast.error(result.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const updateData = { ...userFormData };
      delete updateData.password; // Don't send password in update
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('User updated successfully');
        setShowUserModal(false);
        setEditingUser(null);
        resetUserForm();
        loadUsers();
      } else {
        toast.error(result.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('User deleted successfully');
        loadUsers();
      } else {
        toast.error(result.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const openUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive
      });
    } else {
      setEditingUser(null);
      resetUserForm();
    }
    setShowUserModal(true);
  };

  const resetUserForm = () => {
    setUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'student',
      isActive: true
    });
  };

  const handleUserInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const loadData = () => {
    loadStats();
    loadAnnouncements();
    loadUsers();
    loadPosts();
    loadReels();
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this resource? This action cannot be undone.')) {
      deleteResource(id);
      loadData();
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleDismissReport = async (type, id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dismiss/${type}/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        loadData(); // Refresh the data
      } else {
        toast.error(result.message || 'Failed to dismiss report');
      }
    } catch (error) {
      console.error('Error dismissing report:', error);
      toast.error('Error dismissing report');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <MdDashboard className="text-blue-400" />
              Admin Dashboard
            </h1>
            <p className="text-indigo-200 mt-1">Platform overview & content management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/20 transition"
            >
              <MdRefresh className="text-white" />
              <span className="text-white">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/30 hover:bg-red-500/30 transition"
            >
              <MdLogout className="text-red-300" />
              <span className="text-red-300">Logout</span>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm text-gray-300">Logged in as</p>
              <p className="font-semibold">{user?.firstName} {user?.lastName} (Admin)</p>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Active</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: MdDashboard },
              { id: 'users', label: 'Users', icon: MdPeople },
              { id: 'posts', label: 'Posts', icon: MdArticle },
              { id: 'reels', label: 'Reels', icon: MdVideoLibrary },
              { id: 'reports', label: 'Reports', icon: MdReport },
              { id: 'announcements', label: 'Announcements', icon: MdAnnouncement },
              { id: 'resources', label: 'Resources', icon: MdLibraryBooks },
              { id: 'chats', label: 'Chats', icon: MdMessage },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-lg border border-white/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="text-lg" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Users</p>
                <p className="text-4xl font-bold text-white">{(stats.totalStudents + stats.totalFaculty).toLocaleString()}</p>
              </div>
              <MdPeople className="text-4xl text-blue-400 opacity-80" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Posts</p>
                <p className="text-4xl font-bold text-white">{stats.totalPosts.toLocaleString()}</p>
              </div>
              <MdArticle className="text-4xl text-purple-400 opacity-80" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Reels</p>
                <p className="text-4xl font-bold text-white">{stats.totalReels.toLocaleString()}</p>
              </div>
              <MdVideoLibrary className="text-4xl text-amber-400 opacity-80" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Chats</p>
                <p className="text-4xl font-bold text-white">{stats.totalChats.toLocaleString()}</p>
              </div>
              <MdMessage className="text-4xl text-green-400 opacity-80" />
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <MdReport className="text-red-400" />
              Reported Posts ({stats.reportedPosts})
            </h2>
            {reports.posts.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                <p>No reported posts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.posts.map((post) => (
                  <div key={post.id} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{post.title}</p>
                      <p className="text-gray-300 text-sm">by {post.author}</p>
                      <p className="text-red-400 text-sm">{post.reports} reports</p>
                    </div>
                    <button
                      onClick={() => handleDismissReport('post', post.id)}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <MdReport className="text-red-400" />
              Reported Reels ({stats.reportedReels})
            </h2>
            {reports.reels.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                <p>No reported reels</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.reels.map((reel) => (
                  <div key={reel.id} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{reel.title}</p>
                      <p className="text-gray-300 text-sm">by {reel.author}</p>
                      <p className="text-red-400 text-sm">{reel.reports} reports</p>
                    </div>
                    <button
                      onClick={() => handleDismissReport('reel', reel.id)}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MdPeople className="text-blue-400" />
                User Management ({users.length})
              </h2>
              <button
                onClick={() => openUserModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition"
              >
                <MdAdd className="text-blue-300" />
                <span className="text-blue-300">Create User</span>
              </button>
            </div>
            
            {users.length === 0 ? (
              <div className="text-center py-12 text-gray-300">
                <MdPeople className="text-5xl mx-auto mb-3 opacity-50" />
                <p>No users have been created yet.</p>
                <p className="text-sm mt-2">Click "Create User" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <img 
                            src={user.image || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                            alt={user.firstName}
                            className="w-10 h-10 rounded-full border border-white/20"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                            user.role === 'faculty' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {user.role?.toUpperCase() || 'USER'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                          {user.lastLogin && (
                            <span>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openUserModal(user)}
                          className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition flex items-center gap-2"
                        >
                          <MdEdit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition flex items-center gap-2"
                        >
                          <MdDelete size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <MdArticle className="text-purple-400" />
              Post Management
            </h2>
            <div className="text-center py-12 text-gray-300">
              <MdArticle className="text-5xl mx-auto mb-3 opacity-50" />
              <p>Post Management Component</p>
              <p className="text-sm mt-2">Component file was deleted</p>
            </div>
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <MdVideoLibrary className="text-amber-400" />
              Reel Management
            </h2>
            <div className="text-center py-12 text-gray-300">
              <MdVideoLibrary className="text-5xl mx-auto mb-3 opacity-50" />
              <p>Reel Management Component</p>
              <p className="text-sm mt-2">Component file was deleted</p>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <MdLibraryBooks className="text-green-400" />
              Resource Management
            </h2>
            <div className="text-center py-12 text-gray-300">
              <MdLibraryBooks className="text-5xl mx-auto mb-3 opacity-50" />
              <p>Resource Management Component</p>
              <p className="text-sm mt-2">Component file was deleted</p>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <MdMessage className="text-green-400" />
              Chat Management
            </h2>
            <div className="text-center py-12 text-gray-300">
              <MdMessage className="text-5xl mx-auto mb-3 opacity-50" />
              <p>Chat Management Component</p>
              <p className="text-sm mt-2">Component file was deleted</p>
            </div>
          </div>
        )}

        {/* Announcements Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MdAnnouncement className="text-amber-400" />
              Announcements ({announcements.length})
            </h2>
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-md rounded-xl border border-amber-500/30 hover:bg-amber-500/30 transition"
            >
              <MdAdd className="text-amber-300" />
              <span className="text-amber-300">Create Announcement</span>
            </button>
          </div>
          
          {announcements.length === 0 ? (
            <div className="text-center py-12 text-gray-300">
              <MdAnnouncement className="text-5xl mx-auto mb-3 opacity-50" />
              <p>No announcements have been created yet.</p>
              <p className="text-sm mt-2">Click "Create Announcement" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{announcement.title}</h3>
                      <p className="text-gray-300 text-sm mb-2 line-clamp-2">{announcement.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.visibility === 'public' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {announcement.visibility.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.type === 'job' ? 'bg-purple-500/20 text-purple-300' :
                          announcement.type === 'event' ? 'bg-indigo-500/20 text-indigo-300' :
                          announcement.type === 'academic' ? 'bg-cyan-500/20 text-cyan-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {announcement.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {announcement.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>By {announcement.author?.firstName} {announcement.author?.lastName}</span>
                        <span>Target: {announcement.targetAudience?.join(', ') || 'All'}</span>
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resources Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <MdLibraryBooks />
            All Shared Resources ({stats.totalResources})
          </h2>
          {resources.length === 0 ? (
            <div className="text-center py-12 text-gray-300">
              <MdLibraryBooks className="text-5xl mx-auto mb-3 opacity-50" />
              <p>No resources have been shared yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-200">
                <thead className="border-b border-white/20">
                  <tr>
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Faculty</th>
                    <th className="pb-3 font-semibold">Description</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((res) => (
                    <tr key={res.id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="py-3 pr-4">
                        <a
                          href={res.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-300 hover:text-amber-200 underline"
                        >
                          {res.title}
                        </a>
                       </td>
                      <td className="py-3 pr-4">{res.facultyName}</td>
                      <td className="py-3 pr-4 max-w-xs truncate">{res.description}</td>
                      <td className="py-3 pr-4 text-sm">
                        {new Date(res.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded-full transition"
                          title="Delete resource"
                        >
                          <MdDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Content View Modal */}
        {showContentModal && selectedContent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedContent.type === 'post' ? 'Post Details' : 'Reel Details'}
                </h3>
                <button
                  onClick={() => setShowContentModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <MdDelete size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={selectedContent.user?.image || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                    alt={selectedContent.user?.firstName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-gray-800 font-medium">{selectedContent.user?.firstName} {selectedContent.user?.lastName}</h4>
                    <p className="text-gray-500 text-sm">{new Date(selectedContent.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{selectedContent.content}</p>
                {selectedContent.image && (
                  <img 
                    src={selectedContent.image} 
                    alt="Content image" 
                    className="rounded-lg max-w-full mb-4"
                  />
                )}
                {selectedContent.video && (
                  <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500 mb-4">
                    <MdVideoLibrary className="text-4xl mx-auto mb-2" />
                    <p>Video Content</p>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span> Likes: {selectedContent.likes?.length || 0}</span>
                  <span> Comments: {selectedContent.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <MdClose size={24} />
                </button>
              </div>
              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={userFormData.firstName}
                      onChange={handleUserInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={userFormData.lastName}
                      onChange={handleUserInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userFormData.email}
                    onChange={handleUserInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={userFormData.password}
                      onChange={handleUserInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={userFormData.isActive}
                    onChange={handleUserInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active User
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <MdSave size={16} />
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Announcement Modal */}
        {showAnnouncementModal && (
          <AnnouncementCreate
            onClose={() => setShowAnnouncementModal(false)}
            onAnnouncementCreated={(newAnnouncement) => {
              setAnnouncements(prev => [newAnnouncement, ...prev]);
              toast.success("Announcement created successfully!");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
