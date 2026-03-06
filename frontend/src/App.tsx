import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Navbar } from './components/Navbar';

// Lazy loading pages can be done here, but we will import directly for simplicity
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import StockDetail from './pages/StockDetail';
import Watchlist from './pages/Watchlist';
import TradeHistory from './pages/TradeHistory';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuthStore();

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
};

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Router>
            <div className="min-h-screen bg-slate-50 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/40 text-slate-900 selection:bg-blue-200">
                <Navbar />
                <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
                        <Route path="/market/:symbol" element={<ProtectedRoute><StockDetail /></ProtectedRoute>} />
                        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
                        <Route path="/history" element={<ProtectedRoute><TradeHistory /></ProtectedRoute>} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
