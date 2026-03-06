import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { useMarketStore } from '../store/useMarketStore';

interface WatchlistItem {
    id: string;
    symbol: string;
}

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { stocks, fetchInitialStocks, initializeSocketEvents } = useMarketStore();
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            await fetchInitialStocks();
            const cleanup = initializeSocketEvents();

            try {
                const res = await api.get('/watchlist');
                setWatchlist(res.data);
            } catch (err) {
                console.error('Failed to load watchlist', err);
            } finally {
                setLoading(false);
            }

            return cleanup;
        };
        init();
    }, []);

    const removeFromWatchlist = async (symbol: string) => {
        try {
            await api.delete(`/watchlist/${symbol}`);
            setWatchlist(watchlist.filter(w => w.symbol !== symbol));
        } catch (err) {
            console.error('Failed to remove from watchlist');
        }
    };

    const watchlistWithData = watchlist.map(w => {
        const stockData = stocks.find(s => s.symbol === w.symbol);
        return { ...w, ...stockData };
    });

    if (loading) return <div className="p-10 text-center">Loading Watchlist...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Your Watchlist</h1>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden transition-all">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200/60 w-full text-slate-600 text-sm">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Symbol</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">LTP (NPR)</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Change</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-500 uppercase tracking-wider text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {watchlistWithData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                                        Your watchlist is empty. Add stocks from the market!
                                    </td>
                                </tr>
                            ) : watchlistWithData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-all duration-200">
                                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                                        <button onClick={() => navigate(`/market/${item.symbol}`)} className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2">
                                            {item.symbol}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 font-semibold whitespace-nowrap text-slate-800">
                                        {item.price ? item.price.toFixed(2) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {(item.change !== undefined && item.change !== 0) ? (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${item.change > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                                                {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change).toFixed(2)}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                                        <button
                                            onClick={() => navigate(`/market/${item.symbol}`)}
                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            Trade
                                        </button>
                                        <button
                                            onClick={() => removeFromWatchlist(item.symbol)}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
