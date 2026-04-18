import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((store) => store?.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a1a2f]">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-300 text-lg">
            Here's what's happening on campus today.
          </p>
        </div>

        {/* Simple Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Campus Life
            </h3>
            <p className="text-gray-300">
              Stay connected with your classmates and professors through our chat system.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              Resources
            </h3>
            <p className="text-gray-300">
              Access study materials, notes, and other educational resources.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              Events
            </h3>
            <p className="text-gray-300">
              Keep track of upcoming campus events and activities.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-blue-400 mb-2">5,000+</div>
              <div className="text-gray-300">Students</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-300">Chat Available</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-purple-400 mb-2">200+</div>
              <div className="text-gray-300">Clubs</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-orange-400 mb-2">100+</div>
              <div className="text-gray-300">Resources</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
