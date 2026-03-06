import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import { LogIn, UserPlus } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const login = useAuthStore(state => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const res = await api.post(endpoint, { email, password });
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-100/50 mt-4 mx-4 md:mx-auto max-w-6xl">
            {/* Left side - Branding & Copy */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-16">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-black text-xl tracking-tighter">D</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">DemoTrade</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
                        Unlock the Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">NEPSE</span> Investing.
                    </h1>

                    <ul className="space-y-6 mt-10">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            </div>
                            <p className="ml-4 text-lg text-slate-300 font-medium">Practice trading Nepal Stock Exchange (NEPSE) shares with virtual money.</p>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                            </div>
                            <p className="ml-4 text-lg text-slate-300 font-medium">Gain confidence before risking your own real rupees.</p>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            </div>
                            <p className="ml-4 text-lg text-slate-300 font-medium">Learn how local markets fluctuate in a 100% safe space.</p>
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 text-slate-400 font-medium text-sm">
                    © 2026 DemoTrade Simulator. Built for educational purposes.
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 bg-slate-50/50">
                <div className="max-w-md w-full">
                    <div className="lg:hidden mb-10 flex items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-black text-xl tracking-tighter">D</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">DemoTrade</span>
                    </div>

                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            {isLogin ? 'Sign In to Simulator' : 'Create Simulator Account'}
                        </h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            {isLogin ? 'Welcome back! Ready to manage your virtual holding?' : 'Join for free and get a starting virtual balance of NPR 100,000.'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm font-medium"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm font-medium"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
                            >
                                {loading ? 'Processing...' : (
                                    <span className="flex items-center gap-2">
                                        {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                                        {isLogin ? 'CONTINUE' : 'REGISTER NOW'}
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-slate-50 text-sm font-semibold text-slate-500">OR</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-bold text-blue-600 hover:text-indigo-600 transition-colors"
                        >
                            {isLogin ? "New to DemoTrade? Register Now" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
