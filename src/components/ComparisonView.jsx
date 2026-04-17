import React, { useState, useEffect, useRef } from 'react';
import { fetchStocks } from '../services/api';
import clsx from 'clsx';
import { Layers, Search, X, TrendingUp, Info, FileText } from 'lucide-react';
import StockReport from './StockReport';

const ComparisonView = () => {
    // State Management for stocks and selections
    const [stocks, setStocks] = useState([]);
    const [selectedStocks, setSelectedStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // State Management for Searchable Dropdown
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [reportStock, setReportStock] = useState(null);
    const dropdownRef = useRef(null);

    // API Integration
    useEffect(() => {
        const loadStocks = async () => {
            try {
                // GET request to Django backend (via configured axios service)
                const response = await fetchStocks();
                setStocks(response.data);
            } catch (error) {
                console.error("Error fetching stocks for comparison", error);
            } finally {
                setLoading(false);
            }
        };
        loadStocks();

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectStock = (stockId) => {
        setSelectedStocks(prev => {
            if (prev.includes(stockId)) return prev;
            if (prev.length >= 3) return prev; // Limit to 3
            return [...prev, stockId];
        });
        setSearchTerm('');
        setIsDropdownOpen(false);
    };

    const handleRemoveStock = (stockId) => {
        setSelectedStocks(prev => prev.filter(id => id !== stockId));
    };

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center bg-gray-800 rounded-xl border border-gray-700 animate-pulse mt-8">
                <span className="text-gray-400 font-medium flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 animate-bounce" />
                    Loading comparison tool...
                </span>
            </div>
        );
    }

    const comparingStocks = stocks.filter(s => selectedStocks.includes(s.id));
    const categories = ['All', ...new Set(stocks.map(s => s.sector).filter(Boolean))];

    // Filter available stocks based on Category, Search Term, and filtering out already selected
    const availableStocks = stocks.filter(stock => {
        if (selectedCategory !== 'All' && stock.sector !== selectedCategory) return false;
        if (selectedStocks.includes(stock.id)) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const symbolMatch = stock.symbol.toLowerCase().includes(term);
            const nameMatch = stock.company_name?.toLowerCase().includes(term);
            if (!symbolMatch && !nameMatch) return false;
        }
        return true;
    });

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl mt-8">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <Layers className="text-blue-500 w-6 h-6" />
                    <h2 className="text-2xl font-bold text-white">Compare Stocks</h2>
                </div>
                <p className="text-sm text-gray-400">Select up to 3 stocks to compare</p>
            </div>

            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-gray-700 items-start md:items-center">
                    <label htmlFor="sector-filter" className="text-gray-400 text-sm font-medium whitespace-nowrap">Filter by Sector:</label>
                    <div className="relative w-full md:w-64">
                        <select
                            id="sector-filter"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSearchTerm('');
                            }}
                            className="w-full appearance-none bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg pl-4 pr-10 py-2.5 outline-none hover:border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm cursor-pointer"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Search & Selection Area */}
                <div className="flex flex-col md:flex-row gap-6 items-start mb-8">

                    {/* Autocomplete Search Dropdown */}
                    <div className="relative w-full md:w-1/3" ref={dropdownRef}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                autoComplete="off"
                                spellCheck="false"
                                placeholder={selectedStocks.length >= 3 ? "Maximum 3 selected" : "Search stocks..."}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                disabled={selectedStocks.length >= 3}
                                className={clsx(
                                    "w-full bg-gray-900 border text-sm text-white pl-10 pr-4 py-2.5 outline-none transition-all shadow-sm relative z-50",
                                    isDropdownOpen && selectedStocks.length < 3
                                        ? "rounded-t-lg rounded-b-none border-blue-500"
                                        : "rounded-lg border-gray-700 hover:border-gray-500 focus:border-blue-500",
                                    selectedStocks.length >= 3 && "border-red-500/30 opacity-50 cursor-not-allowed border-gray-700"
                                )}
                            />
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && selectedStocks.length < 3 && (
                            <div className="absolute z-40 w-full mt-0 bg-gray-900 border border-t-0 border-blue-500 rounded-b-lg shadow-2xl max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full pt-1">
                                {availableStocks.length > 0 ? (
                                    availableStocks.map(stock => (
                                        <button
                                            key={stock.id}
                                            onClick={() => handleSelectStock(stock.id)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-800 flex flex-col transition-colors border-b border-gray-800 last:border-0 group"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{stock.symbol}</span>
                                                {stock.sector && (
                                                    <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded uppercase tracking-wider ml-2 shrink-0">{stock.sector}</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1 truncate w-full">{stock.company_name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        No stocks found matching your criteria.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Selected Stocks UI (Pills) */}
                    <div className="flex flex-wrap gap-3 flex-1">
                        {comparingStocks.length === 0 && (
                            <div className="text-sm text-gray-500 italic py-2">
                                Search and select up to 3 stocks to begin comparison.
                            </div>
                        )}
                        {comparingStocks.map(stock => (
                            <div
                                key={stock.id}
                                className="bg-blue-600 border border-blue-500 text-white px-4 py-2 hover:-translate-y-0.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-3 transition-all"
                            >
                                <div className="flex flex-col">
                                    <span>{stock.symbol}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveStock(stock.id)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label={`Remove ${stock.symbol}`}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                {comparingStocks.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                        <table className="w-full text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 w-1/4">Metric</th>
                                    {comparingStocks.map(stock => (
                                        <th key={stock.id} className="px-6 py-4 text-center border-l border-gray-700">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-blue-400 font-bold text-base">{stock.symbol}</span>
                                                <button 
                                                    onClick={() => setReportStock(stock)}
                                                    className="flex items-center gap-1.5 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[10px] font-bold rounded border border-blue-500/30 transition-all"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    VIEW REPORT
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">Sector / Status</td>
                                    {comparingStocks.map(stock => (
                                        <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 text-sm">
                                            <div className="font-semibold text-blue-400 uppercase tracking-wide">{stock.sector || 'None'}</div>
                                            <div className={clsx("text-[10px] mt-1 font-bold inline-block px-1.5 py-0.5 rounded", 
                                                stock.status === 'REG' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                            )}>
                                                {stock.status || 'None'}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 bg-gray-900/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">Latest Price</td>
                                    {comparingStocks.map(stock => (
                                        <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono text-lg text-emerald-400">
                                            ${stock.latest_price?.close_price || '0.00'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">Price (Day Earlier)</td>
                                    {comparingStocks.map(stock => (
                                        <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono text-gray-400">
                                            {stock.previous_price ? `$${stock.previous_price.close_price}` : '0.00'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">SMA (20 Day)</td>
                                    {comparingStocks.map(stock => (
                                        <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono">
                                            {stock.latest_analysis?.sma_20 || '0.00'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 bg-gray-900/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">RSI (14 Day)</td>
                                    {comparingStocks.map(stock => {
                                        const rsi = stock.latest_analysis?.rsi_14;
                                        return (
                                            <td key={stock.id} className={clsx("px-6 py-4 text-center border-l border-gray-700 font-mono font-bold",
                                                rsi < 30 ? "text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]" :
                                                    rsi > 70 ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" :
                                                        "text-gray-400"
                                            )}>
                                                {rsi || '0.00'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">EMA (20 Day)</td>
                                    {comparingStocks.map(stock => (
                                        <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono">
                                            {stock.latest_analysis?.ema_20 || '0.00'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 bg-gray-900/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">MACD (Line/Signal)</td>
                                    {comparingStocks.map(stock => {
                                        const macd = stock.latest_analysis?.macd;
                                        const signal = stock.latest_analysis?.macd_signal;
                                        return (
                                            <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono text-sm">
                                                {macd && signal ? (
                                                    <span className={macd > signal ? "text-green-400" : "text-red-400"}>
                                                        {Number(macd).toFixed(2)} / {Number(signal).toFixed(2)}
                                                    </span>
                                                ) : '0.00 / 0.00'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">Stochastic (K/D)</td>
                                    {comparingStocks.map(stock => {
                                        const k = stock.latest_analysis?.stoch_k;
                                        const d = stock.latest_analysis?.stoch_d;
                                        return (
                                            <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono text-sm">
                                                {k && d ? `${Number(k).toFixed(2)} / ${Number(d).toFixed(2)}` : '0.00 / 0.00'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 bg-gray-900/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">Bollinger Bands (Upper/Lower)</td>
                                    {comparingStocks.map(stock => {
                                        const upper = stock.latest_analysis?.bb_upper;
                                        const lower = stock.latest_analysis?.bb_lower;
                                        return (
                                            <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono text-sm text-gray-300">
                                                {upper && lower ? `${Number(upper).toFixed(2)} / ${Number(lower).toFixed(2)}` : '0.00 / 0.00'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">ATR (14 Day)</td>
                                    {comparingStocks.map(stock => (
                                        <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono text-sm">
                                            {stock.latest_analysis?.atr_14 ? Number(stock.latest_analysis.atr_14).toFixed(3) : '0.000'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 bg-gray-900/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">VWAP</td>
                                    {comparingStocks.map(stock => {
                                        const vwap = stock.latest_analysis?.vwap;
                                        const price = stock.latest_price?.close_price;
                                        return (
                                            <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono text-sm">
                                                {vwap ? (
                                                    <span className={price && Number(price) > Number(vwap) ? "text-green-400" : "text-yellow-500"}>
                                                        {Number(vwap).toFixed(2)}
                                                    </span>
                                                ) : '0.00'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">KSE Index Presence</td>
                                    {comparingStocks.map(stock => {
                                        const indices = stock.index_membership ? stock.index_membership.split(',').length : 0;
                                        return (
                                            <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 text-sm">
                                                <span className="font-bold text-gray-200">{indices}</span>
                                                <div className="text-[10px] text-gray-500 truncate px-2">{stock.index_membership || 'None'}</div>
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 bg-gray-900/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">Dividends (LY Count / Amount)</td>
                                    {comparingStocks.map(stock => (
                                        <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 text-sm text-yellow-400 font-mono">
                                             {stock.dividend_count_ly} / {stock.dividend_amount_ly}%
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">Company Age (Years)</td>
                                    {comparingStocks.map(stock => {
                                        const yearOfIncorp = stock.incorporation_date ? new Date(stock.incorporation_date).getFullYear() : null;
                                        const age = yearOfIncorp ? new Date().getFullYear() - yearOfIncorp : 'None';
                                        return (
                                            <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 text-sm font-bold text-gray-400">
                                                 {age}
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">OBV</td>
                                    {comparingStocks.map(stock => {
                                        const obv = stock.latest_analysis?.obv;
                                        return (
                                            <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700 font-mono text-sm">
                                                 {obv ? Number(obv).toLocaleString() : '0'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr className="hover:bg-gray-800/50 bg-gray-900/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white bg-gray-900/30">AI Recommendation Score</td>
                                    {comparingStocks.map(stock => {
                                        const score = stock.latest_analysis?.recommendation_score || 0;
                                        return (
                                            <td key={stock.id} className="px-6 py-4 text-center border-l border-gray-700">
                                                <span className={clsx("px-3 py-1 rounded-full font-bold text-sm border",
                                                    score > 60 ? "bg-green-500/10 text-green-400 border-green-500/30" :
                                                        score < 40 ? "bg-red-500/10 text-red-500 border-red-500/30" :
                                                            "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                                                )}>
                                                    {score}/100
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Consolidated Report Modal */}
            {reportStock && (
                <StockReport 
                    stock={reportStock} 
                    onClose={() => setReportStock(null)} 
                />
            )}
        </div>
    );
};

export default ComparisonView;
