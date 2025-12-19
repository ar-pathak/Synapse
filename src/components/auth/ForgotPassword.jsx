import React, { useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);
        
        try {
            await axios.post(`${API_URL}/api/auth/forgot-password`, {
                email: email,
            });
            
            toast.success('Password reset link sent successfully! Please check your email inbox.');
            setIsSubmitted(true);
            
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error(error.response?.data?.message || 'Failed to send password reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);
        
        try {
            await axios.post(`${API_URL}/api/auth/forgot-password`, {
                email: email,
            });
            
            toast.success('Password reset link sent again! Please check your email inbox.');
            
        } catch (error) {
            console.error('Resend error:', error);
            toast.error(error.response?.data?.message || 'Failed to resend password reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1B1E] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 py-8 lg:py-0 min-h-[100vh] lg:min-h-0">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left max-w-lg w-full">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                            Forgot Password?
                        </h1>
                        <p className="text-white/60 text-base sm:text-lg mb-6 lg:mb-8 leading-relaxed">
                            No worries! Enter your email address and we'll send you a link to reset your password.
                        </p>
                        
                        {/* Feature list - Show on all devices but different layouts */}
                        <div className="flex flex-col gap-3 sm:gap-4 mb-6 lg:mb-0">
                            <div className="flex items-center gap-3 text-white/60 text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Enter your email address</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span>Check your email for reset link</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <span>Create a new secure password</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Forgot Password Form */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 ring-1 ring-white/10">
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 leading-tight">
                                    {isSubmitted ? 'Check Your Email' : 'Reset Your Password'}
                                </h2>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {isSubmitted 
                                        ? 'We sent a password reset link to your email address.'
                                        : 'Enter your email address to receive a password reset link.'
                                    }
                                </p>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="mb-6 p-4 bg-white/10 rounded-lg text-center">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    <p className="text-white/60 mt-2 text-sm sm:text-base">
                                        {isSubmitted ? 'Sending reset link...' : 'Processing your request...'}
                                    </p>
                                </div>
                            )}

                            {/* Password Reset Form */}
                            {!isSubmitted && (
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-white/80 text-sm font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 sm:px-4 py-3 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition text-sm sm:text-base"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 px-4 bg-white text-[#1A1B1E] rounded-lg font-semibold hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] sm:min-h-[48px] touch-manipulation"
                                    >
                                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </form>
                            )}

                            {/* Success State Actions */}
                            {isSubmitted && (
                                <div className="space-y-4 sm:space-y-6">
                                    <button
                                        onClick={handleResend}
                                        disabled={isLoading}
                                        className="w-full py-3 px-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] sm:min-h-[48px] touch-manipulation"
                                    >
                                        {isLoading ? 'Sending...' : 'Resend Reset Link'}
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            setIsSubmitted(false)
                                            setEmail('')
                                        }}
                                        className="w-full py-3 px-4 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition text-sm sm:text-base min-h-[44px] sm:min-h-[48px] touch-manipulation"
                                    >
                                        Try Different Email
                                    </button>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3 sm:space-y-4 mt-6">
                                <div className="text-center">
                                    <p className="text-white/60 text-xs sm:text-sm">
                                        Remember your password?{' '}
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
                                    <p>• Contact support if you continue having issues</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
