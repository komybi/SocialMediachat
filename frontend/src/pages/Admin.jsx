// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { MdDashboard, MdPeople, MdSchool, MdLibraryBooks, MdDelete, MdRefresh } from 'react-icons/md';
import { getResources, deleteResource } from '../services/resourceService';

const Admin = () => {
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({
    totalResources: 0,
    totalFaculty: 0,
    totalStudents: 12580, // mock static – replace with real data
  });

  const loadData = () => {
    const allResources = getResources();
    setResources(allResources);
    const uniqueFaculty = new Set(allResources.map((r) => r.facultyId));
    setStats((prev) => ({
      ...prev,
      totalResources: allResources.length,
      totalFaculty: uniqueFaculty.size,
    }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <MdDashboard className="text-blue-400" />
              Admin 
            </h1>
            <p className="text-indigo-200 mt-1">Platform overview & resource management</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/20 transition"
          >
            <MdRefresh className="text-white" />
            <span className="text-white">Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Resources</p>
                <p className="text-4xl font-bold text-white">{stats.totalResources}</p>
              </div>
              <MdLibraryBooks className="text-4xl text-blue-400 opacity-80" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Faculty</p>
                <p className="text-4xl font-bold text-white">{stats.totalFaculty}</p>
              </div>
              <MdSchool className="text-4xl text-purple-400 opacity-80" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Students</p>
                <p className="text-4xl font-bold text-white">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <MdPeople className="text-4xl text-amber-400 opacity-80" />
            </div>
          </div>
        </div>

        {/* All Resources Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <MdLibraryBooks />
            All Shared Resources (All Faculty)
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
      </div>
    </div>
  );
};

export default Admin;