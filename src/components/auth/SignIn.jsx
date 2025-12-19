import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setIsLoggedIn, setUserinfo } from '../../store/slice/userinfoSlice'
import { API_URL } from '../../utils/constants'
import toast from 'react-hot-toast'


const SignIn = () => {
    const isLoggedIn = useSelector((state) => state.userinfo.isLoggedIn)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email, setEmail] = useState("thor31950@gmail.com")
    const [password, setPassword] = useState("Thor3195@0")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const onSubmit = async (email, password) => {
        setIsSubmitting(true)
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, {
                email: email,
                password: password
            }, { withCredentials: true })
            
            // Show success toast
            toast.success(`Welcome back, ${res?.data?.user?.fullName || res?.data?.user?.name || 'User'}! 🎉`)
            
            dispatch(setUserinfo(res?.data?.user))
            dispatch(setIsLoggedIn(true))
            
            // Navigate after a short delay to show the toast
            setTimeout(() => {
                navigate("/")
            }, 1000)
            
        } catch (error) {
            console.log(error)
            
            // Show error toast with specific error message
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Login failed. Please check your credentials and try again.'
            
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }
    if (isLoggedIn) {
        return <Navigate to="/feed" />
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1B1E] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left max-w-lg">
                        <h1 className="text-5xl font-bold text-white mb-6">Welcome Back!</h1>
                        <p className="text-white/60 text-lg mb-8">
                            Connect with developers worldwide and continue your journey in the tech community.
                        </p>
                        <div className="hidden lg:flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-white/60">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Connect with developers worldwide</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Share your projects and ideas</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Grow your network</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Login Form */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-8 ring-1 ring-white/10">
                            <h2 className="text-2xl font-semibold text-white mb-6">Log In to Your Account</h2>
                            <form className="space-y-6" onSubmit={e => {
                                e.preventDefault();
                                
                                // Form validation
                                if (!email.trim()) {
                                    toast.error('Please enter your email address')
                                    return
                                }
                                
                                if (!password.trim()) {
                                    toast.error('Please enter your password')
                                    return
                                }
                                
                                // Basic email validation
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                if (!emailRegex.test(email)) {
                                    toast.error('Please enter a valid email address')
                                    return
                                }
                                
                                onSubmit(email, password);
                            }}>
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => { setPassword(e.target.value) }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 bg-white/5 border-white/10 rounded focus:ring-white/20"
                                        />
                                        <label className="ml-2 text-sm text-white/60">Remember me</label>
                                    </div>
                                    <Link to="/auth/forgot-password" className="text-sm text-white/60 hover:text-white transition">
                                        Forgot password?
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                                        isSubmitting 
                                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                                            : 'bg-white text-[#1A1B1E] hover:bg-white/90'
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                                            Signing In...
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>
                            <div className="mt-6 text-center">
                                <p className="text-white/60">
                                    Don't have an account?{' '}
                                    <Link to="/auth/signup" className="text-white hover:text-white/80 transition">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn