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
  MdAdd
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
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
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

  const loadData = () => {
    loadStats();
    loadAnnouncements();
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