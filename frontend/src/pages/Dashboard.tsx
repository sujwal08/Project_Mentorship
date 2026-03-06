import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useMarketStore } from '../store/useMarketStore';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Holding {
    id: string;
    symbol: string;
    quantity: number;
    averagePrice: string;
}

interface Portfolio {
    balance: string;
    holdings: Holding[];
}

export default function Dashboard() {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [loading, setLoading] = useState(true);
    const { stocks, fetchInitialStocks, initializeSocketEvents } = useMarketStore();

    useEffect(() => {
        const init = async () => {
            await fetchInitialStocks();
            const cleanup = initializeSocketEvents();

            try {
                const res = await api.get('/trades/portfolio');
                setPortfolio(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }

            return cleanup;
        };
        init();
    }, []);

    if (loading) return <div className="text-center p-10">Loading Portfolio...</div>;
    if (!portfolio) return <div className="text-center p-10 text-red-500">Failed to load portfolio</div>;

    const currentBalance = parseFloat(portfolio.balance);
    let totalHoldingsValue = 0;

    const holdingsWithCurrentPrice = portfolio.holdings.map(h => {
        const currentStock = stocks.find(s => s.symbol === h.symbol);
        const currentPrice = currentStock ? currentStock.price : parseFloat(h.averagePrice);
        const currentValue = h.quantity * currentPrice;
        const totalCost = h.quantity * parseFloat(h.averagePrice);
        const profitLoss = currentValue - totalCost;

        totalHoldingsValue += currentValue;

        return { ...h, currentPrice, currentValue, profitLoss };
    });

    const totalPortfolioValue = currentBalance + totalHoldingsValue;

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

    const chartData = holdingsWithCurrentPrice.map(h => ({
        name: h.symbol,
        value: h.currentValue
    }));

    // Add Cash to allocation chart
    chartData.push({ name: 'Cash', value: currentBalance });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-md text-white border border-blue-500/30 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                    <h3 className="text-sm font-medium text-blue-100/80 uppercase tracking-wider">Total Portfolio Value</h3>
                    <p className="mt-3 text-3xl font-bold tracking-tight">NPR {totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-500"></div>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Purchasing Power</h3>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">NPR {currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Holdings Value</h3>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">NPR {totalHoldingsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow border border-gray-100 p-6 lg:col-span-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Allocation</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => `NPR ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden lg:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200/60 w-full text-slate-600 text-sm">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Symbol</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Shares</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Avg Price</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Current Price</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Total Value</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">P&L</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {holdingsWithCurrentPrice.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                            No holdings yet. Head over to the market!
                                        </td>
                                    </tr>
                                ) : holdingsWithCurrentPrice.map(h => (
                                    <tr key={h.id} className="hover:bg-slate-50/80 transition-all duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                                            <a href={`/market/${h.symbol}`} className="hover:text-blue-600 transition-colors uppercase">{h.symbol}</a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold">{h.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">NPR {parseFloat(h.averagePrice).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-semibold">NPR {h.currentPrice.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">NPR {h.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${h.profitLoss >= 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                                                {h.profitLoss >= 0 ? '↑' : '↓'} NPR {Math.abs(h.profitLoss).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
