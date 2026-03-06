import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, Home, TrendingUp, Star, User, History } from 'lucide-react';

export const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300">
                                DemoTrade
                            </span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors">
                                <Home className="w-4 h-4 mr-2 opacity-70" /> Dashboard
                            </Link>
                            <Link to="/market" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors">
                                <TrendingUp className="w-4 h-4 mr-2 opacity-70" /> Market
                            </Link>
                            <Link to="/watchlist" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors">
                                <Star className="w-4 h-4 mr-2 opacity-70" /> Watchlist
                            </Link>
                            <Link to="/history" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors">
                                <History className="w-4 h-4 mr-2 opacity-70" /> History
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-6">
                            <span className="text-sm font-medium text-slate-600 flex items-center px-3 py-1.5 bg-slate-100/50 rounded-full border border-slate-200/50">
                                <User className="w-4 h-4 mr-1.5 text-blue-600" /> {user.email}
                            </span>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                className="inline-flex items-center p-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
