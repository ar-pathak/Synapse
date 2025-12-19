import React from 'react'
import { Link, Outlet } from 'react-router'

const LoginContainer = () => {
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1B1E] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-10">
                    {/* Logo/App Name */}
                    <div className="mb-12 flex flex-col items-center">
                        <div className="w-24 h-24 mb-6 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300">
                            <img src="/logo192.png" alt="App Logo" className="w-20 h-20" />
                        </div>
                        <h1 className="text-6xl font-bold text-white drop-shadow-lg tracking-tight mb-3">Synapse</h1>
                        <p className="text-white/60 text-xl max-w-md text-center">
                            Connect with developers worldwide and build amazing things together
                        </p>
                    </div>

                    {/* Card Container */}
                    <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-8 items-center justify-center gap-8 ring-1 ring-white/10">
                        {/* Log In Card */}
                        <div className="flex-1 flex flex-col items-center cursor-pointer group">
                            <Link to="auth/signin">
                                <div className="w-full p-8 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105">
                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white text-center mb-2 group-hover:text-white/90">Sign In</h3>
                                    <p className="text-white/60 text-center">Sign in to your account</p>
                                </div>
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="divider md:divider-horizontal text-white/30 font-medium">OR</div>

                        {/* Sign Up Card */}
                        <div className="flex-1 flex flex-col items-center cursor-pointer group">
                            <Link to='auth/signup'>
                                <div className="w-full p-8 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105">
                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-6A2.25 2.25 0 006 6.75v10.5A2.25 2.25 0 008.25 19.5h6a2.25 2.25 0 002.25-2.25V13.5" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15l3-3m0 0l-3-3m3 3H12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white text-center mb-2 group-hover:text-white/90">Sign Up</h3>
                                    <p className="text-white/60 text-center">Create a new account</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                            </div>
                            <h3 className="text-white text-lg font-semibold mb-2">Connect</h3>
                            <p className="text-white/60">Find and connect with developers worldwide</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h3 className="text-white text-lg font-semibold mb-2">Collaborate</h3>
                            <p className="text-white/60">Work together on exciting projects</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </div>
                            <h3 className="text-white text-lg font-semibold mb-2">Grow</h3>
                            <p className="text-white/60">Learn and grow your skills together</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const AppLayout = () => {
    return (
        <div className="bg-[#1A1B1E] min-h-screen">
            {location.href.includes("/auth/reset-password") || location.href.includes("/auth/forgot-password") || location.href.includes("/auth/verify-email") || location.href.includes("/auth/signin") || location.href.includes("/auth/signup") ? <Outlet /> : <LoginContainer />}
        </div>
    )
}

export default AppLayout