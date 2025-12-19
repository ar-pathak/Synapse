import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import axios from 'axios'
import { API_URL } from '../../utils/constants'
import toast from 'react-hot-toast'

const VerifyEmail = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [email, setEmail] = useState('')
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        // Auto-verify if token is present
        if (token) {
            verifyEmail(token)
        }
    }, [token])

    const verifyEmail = async (verificationToken) => {
        setIsLoading(true)
        try {
            await axios.get(`${API_URL}/api/auth/verify-email/${verificationToken}`)

            toast.success('Email verified successfully! Redirecting to login...')
            setIsVerified(true)

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/auth/signin')
            }, 3000)

        } catch (error) {
            console.error('Verification error:', error)
            toast.error(error.response?.data?.message || 'Email verification failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const resendVerification = async () => {
        if (!email) {
            toast.error('Please enter your email address')
            return
        }

        setIsResending(true)

        try {
            await axios.post(`${API_URL}/api/auth/resend-verification`, {
                email: email
            })

            toast.success('Verification email sent successfully! Please check your inbox.')

        } catch (error) {
            console.error('Resend error:', error)
            toast.error(error.response?.data?.message || 'Failed to resend verification email. Please try again.')
        } finally {
            setIsResending(false)
        }
    }

    const handleManualVerification = (e) => {
        e.preventDefault()
        if (!email) {
            toast.error('Please enter your email address')
            return
        }
        resendVerification()
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1B1E] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 py-8 lg:py-0 min-h-[100vh] lg:min-h-0">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left max-w-lg w-full">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                            Verify Your Email
                        </h1>
                        <p className="text-white/60 text-base sm:text-lg mb-6 lg:mb-8 leading-relaxed">
                            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                        </p>

                        {/* Feature list - Show on all devices but different layouts */}
                        <div className="flex flex-col gap-3 sm:gap-4 mb-6 lg:mb-0">
                            <div className="flex items-center gap-3 text-white/60 text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Check your email inbox</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span>Click the verification link</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Start connecting with developers</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Verification Form */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 ring-1 ring-white/10">
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 leading-tight">
                                    {isVerified ? 'Email Verified!' : 'Check Your Email'}
                                </h2>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {isVerified
                                        ? 'Your email has been successfully verified.'
                                        : 'We sent a verification link to your email address.'
                                    }
                                </p>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="mb-6 p-4 bg-white/10 rounded-lg text-center">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    <p className="text-white/60 mt-2 text-sm sm:text-base">Verifying your email...</p>
                                </div>
                            )}

                            {/* Manual Email Input */}
                            {!token && !isVerified && (
                                <form onSubmit={handleManualVerification} className="space-y-4 sm:space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-white/80 text-sm font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 sm:px-4 py-3 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition text-sm sm:text-base"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isResending}
                                        className="w-full py-3 px-4 bg-white text-[#1A1B1E] rounded-lg font-semibold hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] sm:min-h-[48px] touch-manipulation"
                                    >
                                        {isResending ? 'Sending...' : 'Resend Verification Email'}
                                    </button>
                                </form>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3 sm:space-y-4 mt-6">
                                {!isVerified && (
                                    <button
                                        onClick={resendVerification}
                                        disabled={isResending || !email}
                                        className="w-full py-3 px-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] sm:min-h-[48px] touch-manipulation"
                                    >
                                        {isResending ? 'Sending...' : 'Resend Email'}
                                    </button>
                                )}

                                <div className="text-center">
                                    <p className="text-white/60 text-xs sm:text-sm">
                                        Already verified?{' '}
                                        <Link to="/auth/signin" className="text-white hover:text-white/80 transition font-medium">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>

                                <div className="text-center">
                                    <p className="text-white/60 text-xs sm:text-sm">
                                        Don't have an account?{' '}
                                        <Link to="/auth/signup" className="text-white hover:text-white/80 transition font-medium">
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                                <h3 className="text-white/80 text-sm font-medium mb-2 sm:mb-3">Need Help?</h3>
                                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-white/60">
                                    <p>• Check your spam folder</p>
                                    <p>• Make sure you entered the correct email</p>
                                    <p>• Wait a few minutes for the email to arrive</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail