import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const checkToken = async () => {
            try {
                const res = await axios.post(`${API_URL}/api/auth/check-reset-password-token`, {
                    token
                });
                console.log(res)
                if (res.data.success === true) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                    navigate('/auth/forgot-password');
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'An error occurred');
                navigate('/auth/forgot-password');
            }
        }
        checkToken();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (!token) {
            toast.error('Invalid or missing reset token');
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
                token,
                newPassword,
            }, { withCredentials: true });
            toast.success(res.data.message);
            setTimeout(() => {
                navigate('/auth/signin');
            }, 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1B1E] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-8 ring-1 ring-white/10">
                            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Reset Your Password</h2>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-medium">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                                        placeholder="Enter your new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-medium">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                                        placeholder="Confirm your new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-white text-[#1A1B1E] rounded-lg font-semibold hover:bg-white/90 transition"
                                >
                                    Reset Password
                                </button>
                            </form>
                            <div className="mt-6 text-center">
                                <p className="text-white/60">
                                    Remember your password?{' '}
                                    <Link to="/auth/signin" className="text-white hover:text-white/80 transition">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;