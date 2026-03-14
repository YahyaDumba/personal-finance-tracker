import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../services/api';
import useAuthStore from '../store/authStore';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await loginUser(formData);
            login(res.data.data.user, res.data.data.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        {/* <span className="text-3xl">💎</span> */}
                        <span className="text-2xl font-bold text-white">FinTrack</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mt-6 mb-2">Welcome back</h1>
                    <p className="text-gray-400">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

                    {error && (
                        <div className="bg-red-950 border border-red-800 text-red-400 rounded-xl p-4 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Your password"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mt-2">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300">Sign up</Link>
                    </p>
                    <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                        <p className="text-center text-gray-400 text-sm mb-3 font-medium">
                            For Demo use these credentials
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between bg-gray-900 rounded-lg px-3 py-2">
                                <span className="text-gray-500 text-xs">Email</span>
                                <span className="text-blue-400 text-sm font-mono">yahyadumba63@gmail.com</span>
                            </div>
                            <div className="flex items-center justify-between bg-gray-900 rounded-lg px-3 py-2">
                                <span className="text-gray-500 text-xs">Password</span>
                                <span className="text-blue-400 text-sm font-mono">password</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
