import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { useMarketStore } from '../store/useMarketStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function StockDetail() {
    const { symbol } = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const { stocks, fetchInitialStocks, initializeSocketEvents } = useMarketStore();

    const [quantity, setQuantity] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [inWatchlist, setInWatchlist] = useState(false);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [aiInsight, setAiInsight] = useState<any>(null);

    const stock = stocks.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase());

    useEffect(() => {
        fetchInitialStocks();
        const cleanup = initializeSocketEvents();

        // Check watchlist status
        api.get('/watchlist').then(res => {
            if (res.data.find((w: any) => w.symbol === symbol?.toUpperCase())) {
                setInWatchlist(true);
            }
        }).catch(console.error);

        // Fetch History
        api.get(`/market/stocks/${symbol?.toUpperCase()}/history`)
            .then(res => setHistoryData(res.data))
            .catch(console.error);

        // Fetch AI Insight
        api.get(`/market/stocks/${symbol?.toUpperCase()}/ai-insight`)
            .then(res => setAiInsight(res.data))
            .catch(console.error);

        return cleanup;
    }, [symbol]);

    const handleTrade = async (type: 'BUY' | 'SELL') => {
        if (!quantity || quantity <= 0) return setError('Enter a valid quantity');
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post(`/trades/${type.toLowerCase()}`, {
                symbol: symbol?.toUpperCase(),
                quantity: Number(quantity)
            });
            setSuccess(`Successfully ${type.toLowerCase() === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${symbol?.toUpperCase()}`);
            setQuantity('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Trade failed');
        } finally {
            setLoading(false);
        }
    };

    const toggleWatchlist = async () => {
        try {
            if (inWatchlist) {
                await api.delete(`/watchlist/${symbol?.toUpperCase()}`);
                setInWatchlist(false);
            } else {
                await api.post(`/watchlist/${symbol?.toUpperCase()}`);
                setInWatchlist(true);
            }
        } catch (err) {
            console.error('Failed to update watchlist');
        }
    };

    if (!stock) return <div className="p-10 text-center">Loading stock details...</div>;

    const totalValue = quantity ? stock.price * Number(quantity) : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <button onClick={() => navigate('/market')} className="text-slate-500 hover:text-blue-600 hover:underline mb-2 inline-flex items-center text-sm font-medium transition-colors">
                &larr; Back to Market
            </button>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">{stock.symbol}</h1>
                        <p className="text-xl text-slate-500 mt-2 font-medium">{stock.name}</p>
                    </div>
                    <button
                        onClick={toggleWatchlist}
                        className={`px-5 py-2.5 rounded-xl font-semibold border-2 transition-all ${inWatchlist ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300' : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
                    >
                        {inWatchlist ? '★ In Watchlist' : '☆ Add to Watchlist'}
                    </button>
                </div>

                <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Current Price</p>
                        <p className="mt-2 text-3xl font-black text-slate-900">NPR {stock.price.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Change Today</p>
                        <p className={`mt-2 text-3xl font-black ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">% Change</p>
                        <p className={`mt-2 text-3xl font-black ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </p>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Volume</p>
                        <p className="mt-2 text-3xl font-black text-slate-900">{stock.volume.toLocaleString()}</p>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Price History (30 Days Simulator)</h3>
                    <div className="h-64 sm:h-80 w-full bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                        {historyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(val) => format(new Date(val), 'MMM dd')}
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickMargin={10}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        domain={['auto', 'auto']}
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickFormatter={(val) => `Rs.${val}`}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) => [`NPR ${Number(value).toFixed(2)}`, 'Price']}
                                        labelFormatter={(label) => format(new Date(label), 'PPP')}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">Loading chart data...</div>
                        )}
                    </div>
                </div>

                {/* AI Insight Section */}
                {aiInsight && (
                    <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100/50 shadow-sm relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
                                AI
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">DemoTrade Analysis</h3>
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${aiInsight.sentiment === 'BULLISH' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {aiInsight.sentiment}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">
                                        {aiInsight.confidenceScore}% Confidence
                                    </span>
                                </div>
                                <p className="text-slate-700 font-medium leading-relaxed">
                                    {aiInsight.insight}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-10 border-t border-slate-100 pt-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Execute Trade</h2>

                    {error && <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>}
                    {success && <div className="mb-6 bg-green-50/80 backdrop-blur-sm border border-green-200 text-green-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{success}</div>}

                    <div className="flex flex-col md:flex-row gap-6 items-end bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity (Shares)</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium transition-all shadow-sm"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value))}
                            />
                        </div>

                        <div className="w-full md:w-1/3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Estimated Total</p>
                            <p className="text-xl font-black text-slate-900">NPR {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                        <div className="w-full md:w-1/3 flex gap-3">
                            <button
                                onClick={() => handleTrade('BUY')}
                                disabled={loading || !quantity}
                                className="flex-1 bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-green-500/30 hover:shadow-md hover:shadow-green-500/40 transform hover:-translate-y-0.5"
                            >
                                BUY
                            </button>
                            <button
                                onClick={() => handleTrade('SELL')}
                                disabled={loading || !quantity}
                                className="flex-1 bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-red-500/30 hover:shadow-md hover:shadow-red-500/40 transform hover:-translate-y-0.5"
                            >
                                SELL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
