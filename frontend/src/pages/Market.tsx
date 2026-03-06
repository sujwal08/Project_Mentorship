import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketStore } from '../store/useMarketStore';

export default function Market() {
    const { stocks, isLoading, fetchInitialStocks, initializeSocketEvents } = useMarketStore();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchInitialStocks();
        const cleanup = initializeSocketEvents();
        return cleanup;
    }, []);

    const filteredStocks = stocks.filter(s =>
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-col sm:flex-row gap-4 mb-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Market Overview</h1>
                <div className="w-full sm:w-80 relative group">
                    <input
                        type="text"
                        placeholder="Search symbol or company..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden transition-all">
                {isLoading ? (
                    <div className="p-16 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                        <div className="text-slate-500 font-medium">Syncing live market data...</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200/60 w-full text-slate-600 text-sm">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Symbol</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Company Name</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">LTP (NPR)</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Change</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">% Change</th>
                                    <th className="px-6 py-4 text-right font-semibold text-slate-500 uppercase tracking-wider text-xs">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStocks.map((stock) => (
                                    <tr key={stock.symbol} className="hover:bg-slate-50/80 transition-all duration-200">
                                        <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{stock.symbol}</td>
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{stock.name}</td>
                                        <td className="px-6 py-4 font-semibold whitespace-nowrap text-slate-800">{stock.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${stock.change >= 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                                                {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {stock.changePercent > 0 ? '↑' : '↓'} {Math.abs(stock.changePercent).toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => navigate(`/market/${stock.symbol}`)}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-blue-500/30 hover:shadow-md hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
                                            >
                                                Trade
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStocks.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            No stocks found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
