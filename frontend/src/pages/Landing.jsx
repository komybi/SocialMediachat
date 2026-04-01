import React from "react";
import { Link } from "react-router-dom";
import { MdChat, MdPeople, MdPhotoCamera, MdShare, MdGroup } from "react-icons/md";

const Landing = () => {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#2e1065] relative overflow-x-hidden">
            <div className="absolute inset-0 bg-black/20 z-0"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-pulse blur-xl"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full animate-pulse delay-75 blur-xl"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-emerald-400/20 rounded-full animate-pulse delay-150 blur-xl"></div>
            
            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
                <div className="text-center text-white max-w-6xl mx-auto">
                    {/* Logo/Title */}
                    <div className="mb-12">
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-amber-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <img
                                    src="/logo.jpeg"
                                    alt="BHULink Logo"
                                    className="relative h-32 w-32 rounded-full border-4 border-white/40 shadow-2xl object-cover transform transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
                            BHULink
                        </h1>
                        <p className="text-2xl md:text-3xl font-light mb-2 tracking-wide">
                            The Digital Campus Hub
                        </p>
                        <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-3xl mx-auto">
                            Connect, share, and chat with classmates, professors, and alumni — all in one place.
                        </p>
                        <div className="flex justify-center gap-6 text-sm font-mono text-blue-200/70">
                            <span>✨ 5,000+ students online</span>
                            <span>🎓 200+ clubs & societies</span>
                            <span>📚 24/7 campus chat</span>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/10">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <MdChat className="text-3xl text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Real‑time Chat</h3>
                            <p className="text-gray-200 leading-relaxed">Instant messaging with friends, study groups, and faculty — everywhere.</p>
                        </div>
                        <div className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/10">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <MdPhotoCamera className="text-3xl text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Media Sharing</h3>
                            <p className="text-gray-200 leading-relaxed">Share photos, videos, and campus moments with your network seamlessly.</p>
                        </div>
                        <div className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/10">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <MdGroup className="text-3xl text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Social Network</h3>
                            <p className="text-gray-200 leading-relaxed">Discover clubs, join events, and build your academic community.</p>
                        </div>
                    </div>

                    {/* Main CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                        <Link
                            to="/signup"
                            className="group px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <span>Sign Up – Join the Community</span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5-5m5 5H9" />
                            </svg>
                        </Link>
                        <Link
                            to="/signin"
                            className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <span>Sign In – Welcome Back</span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </div>

                    {/* Quick Access Section */}
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/20 shadow-2xl mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">Quick Access</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Link
                                to="/signup"
                                className="flex items-center justify-center gap-4 px-6 py-5 bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-400/50 rounded-2xl hover:from-amber-600/30 hover:to-amber-500/30 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-xl text-amber-300">New User</div>
                                    <div className="text-gray-300 text-sm">Create your student account</div>
                                </div>
                            </Link>
                            <Link
                                to="/signin"
                                className="flex items-center justify-center gap-4 px-6 py-5 bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-400/50 rounded-2xl hover:from-blue-600/30 hover:to-blue-500/30 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-xl text-blue-300">Returning</div>
                                    <div className="text-gray-300 text-sm">Sign in to your dashboard</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Additional Features */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-gray-200 mb-12">
                        <div className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full backdrop-blur-md border border-white/20">
                            <MdShare className="text-xl text-blue-300" />
                            <span>Easy Sharing</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full backdrop-blur-md border border-white/20">
                            <MdGroup className="text-xl text-purple-300" />
                            <span>Group Chats</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full backdrop-blur-md border border-white/20">
                            <MdPhotoCamera className="text-xl text-emerald-300" />
                            <span>Photo Posts</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/20 pt-8 mt-4 text-gray-300 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>© {new Date().getFullYear()} BHULink – The University Social Network</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition">About</a>
                            <a href="#" className="hover:text-white transition">Privacy</a>
                            <a href="#" className="hover:text-white transition">Support</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;