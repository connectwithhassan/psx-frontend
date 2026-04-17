import React, { useState, useEffect } from 'react';
import { fetchStocks } from '../services/api';
import RecommendationCards from './RecommendationCards';
import StockChart from './StockChart';
import ComparisonView from './ComparisonView';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

const Dashboard = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStocks = async () => {
            try {
                const response = await fetchStocks();
                setStocks(response.data);
            } catch (error) {
                console.error("Error fetching stocks", error);
            } finally {
                setLoading(false);
            }
        };
        loadStocks();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-gray-200">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <TrendingUp className="text-white w-5 h-5" />
                            </div>
                            <h1 className="text-xl font-bold text-white tracking-tight">PSX Eval</h1>
                        </div>
                        <nav className="flex gap-4">
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-white font-medium bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-700">
                                Dashboard
                            </button>
                            <button
                                onClick={() => document.getElementById('compare-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-gray-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors">
                                Compare
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Hiding Welcome Section & Recommendations per request */}
                {/* <div className="mb-10">
                    <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Automated Analysis</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Today's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Top Picks</span></h1>
                    <p className="text-gray-400 max-w-2xl text-lg">Our engine processes PSX market data to identify high-potential investments based on technical indicators like SMA, EMA, and RSI.</p>
                </div>

                <RecommendationCards /> */}

                {/* Comparison Tool */}
                <div id="compare-section" className="scroll-mt-24">
                    <ComparisonView />
                </div>

                {/* Market Overview / Charts Area */}
                <div className="mt-12">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart2 className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white">Market Watch</h2>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center bg-gray-800 rounded-xl border border-gray-700 animate-pulse">
                            <span className="text-gray-400">Loading market overview...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {stocks.slice(0, 4).map(stock => (
                                <StockChart key={stock.id} symbol={stock.symbol} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
