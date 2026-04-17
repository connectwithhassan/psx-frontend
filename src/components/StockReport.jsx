import React from 'react';
import { X, FileText, TrendingUp, Award, Calendar, BarChart3, Info, PieChart, Activity, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const StockReport = ({ stock, onClose }) => {
    if (!stock) return null;

    const latestAnalysis = stock.latest_analysis || {};
    const latestPrice = stock.latest_price || {};
    const prevPrice = stock.previous_price || {};
    const priceChange = latestPrice.close_price && prevPrice.close_price 
        ? ((latestPrice.close_price - prevPrice.close_price) / prevPrice.close_price * 100).toFixed(2)
        : null;

    const yearOfIncorp = stock.incorporation_date ? new Date(stock.incorporation_date).getFullYear() : null;
    const age = yearOfIncorp ? new Date().getFullYear() - yearOfIncorp : 'None';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gradient-to-r from-blue-900/20 to-transparent">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-white leading-tight">{stock.symbol}</h2>
                            <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase", 
                                stock.status === 'REG' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            )}>
                                {stock.status || 'Unknown'}
                            </span>
                        </div>
                        <p className="text-gray-400 font-medium">{stock.company_name}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 uppercase tracking-wider">{stock.sector}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                Member of: {stock.index_membership || 'None'}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    
                    {/* Top Row: Price and Quick Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                            <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-bold">Latest Price</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-mono font-bold text-emerald-400">${latestPrice.close_price || '0.00'}</span>
                                {priceChange !== null && (
                                    <span className={clsx("text-sm font-bold", parseFloat(priceChange) >= 0 ? "text-green-500" : "text-red-500")}>
                                        {parseFloat(priceChange) >= 0 ? '▲' : '▼'} {Math.abs(priceChange)}%
                                    </span>
                                )}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-2 italic font-medium">Day earlier: ${prevPrice.close_price || '0.00'}</div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                            <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-bold tracking-wider">AI Score</div>
                            <div className="flex items-baseline gap-2">
                                <span className={clsx("text-4xl font-mono font-bold", 
                                    latestAnalysis.recommendation_score > 60 ? "text-green-400" : 
                                    latestAnalysis.recommendation_score < 40 ? "text-red-400" : "text-yellow-400"
                                )}>
                                    {latestAnalysis.recommendation_score || '0'}
                                </span>
                                <span className="text-gray-500 font-bold">/100</span>
                            </div>
                            <div className="text-[10px] text-gray-500 mt-2 font-medium">Based on 12 Technical Indicators</div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                            <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-bold">Dividends (LY)</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-mono font-bold text-yellow-400">{stock.dividend_amount_ly}%</span>
                                <span className="text-gray-500 text-sm font-bold">({stock.dividend_count_ly} times)</span>
                            </div>
                            <div className="text-[10px] text-gray-500 mt-2 font-medium">Cumulative for last financial year</div>
                        </div>
                    </div>

                    {/* Middle Section: Technical Details & Profile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Company Profile */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                                <FileText className="w-5 h-5 text-blue-400" />
                                Consolidated Profile
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Company Age</div>
                                    <div className="text-lg font-bold text-gray-200">{age} Years</div>
                                    <div className="text-[10px] text-gray-600 italic">Established: {yearOfIncorp || 'Unknown'}</div>
                                </div>
                                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Daily Volume</div>
                                    <div className="text-lg font-bold text-gray-200">{latestPrice.volume ? Number(latestPrice.volume).toLocaleString() : '0'}</div>
                                    <div className="text-[10px] text-gray-600 italic">Latest session volume</div>
                                </div>
                                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30 col-span-2">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 text-center">Index Weights</div>
                                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                                        {stock.index_membership ? stock.index_membership.split(',').map(idx => (
                                            <span key={idx} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-[10px] font-bold border border-gray-600">
                                                {idx.trim()}
                                            </span>
                                        )) : <span className="text-gray-600 text-[10px]">No index membership found</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Analysis Summary */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                Technical Health
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm p-2 bg-gray-800/20 rounded-md border border-gray-700/30">
                                    <span className="text-gray-400">RSI (Relative Strength)</span>
                                    <span className={clsx("font-mono font-bold", 
                                        latestAnalysis.rsi_14 < 30 ? "text-green-400" : latestAnalysis.rsi_14 > 70 ? "text-red-400" : "text-gray-300"
                                    )}>
                                        {latestAnalysis.rsi_14 || '0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-2 bg-gray-800/20 rounded-md border border-gray-700/30">
                                    <span className="text-gray-400">Moving Average (20 Day)</span>
                                    <span className="font-mono text-gray-200">{latestAnalysis.sma_20 || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-2 bg-gray-800/20 rounded-md border border-gray-700/30">
                                    <span className="text-gray-400">VWAP Support</span>
                                    <span className="font-mono text-gray-200">{latestAnalysis.vwap || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-2 bg-gray-800/20 rounded-md border border-gray-700/30">
                                    <span className="text-gray-400">Stock Status</span>
                                    <span className="font-bold text-blue-400">{stock.status || 'None'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Strategic Analysis & Ratios */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 border-l-4 border-purple-500 pl-4">
                            <Activity className="w-6 h-6 text-purple-400" />
                            AI Strategic Analysis & Ratios
                        </h3>
                        
                        {latestAnalysis.ai_calculations ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(latestAnalysis.ai_calculations).map(([key, value]) => (
                                    <div key={key} className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl flex flex-col items-center text-center">
                                        <div className="text-[10px] text-purple-300 uppercase font-bold mb-1 opacity-70">{key.replace(/_/g, ' ')}</div>
                                        <div className="text-lg font-mono font-bold text-white">{value}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-800/20 rounded-xl border border-gray-700/30 text-center text-gray-500 italic text-sm">
                                AI is still processing financial ratios for this period...
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Final Verdict Card */}
                            <div className={clsx("p-6 rounded-2xl border-2 flex flex-col justify-between shadow-xl", 
                                latestAnalysis.ai_verdict?.toLowerCase().includes('buy') ? "bg-green-900/10 border-green-500/30 text-green-100" :
                                latestAnalysis.ai_verdict?.toLowerCase().includes('sell') ? "bg-red-900/10 border-red-500/30 text-red-100" :
                                "bg-blue-900/10 border-blue-500/30 text-blue-100"
                            )}>
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award className="w-5 h-5 text-current opacity-70" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Gemini AI Verdict</span>
                                    </div>
                                    <p className="text-sm leading-relaxed font-medium">
                                        {latestAnalysis.ai_verdict || "Analysis pending historical financial reconciliation."}
                                    </p>
                                </div>
                            </div>

                            {/* Market Triggers / Announcements */}
                            <div className="bg-gray-800/40 rounded-2xl border border-gray-700/50 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertCircle className="w-5 h-5 text-yellow-400 opacity-70" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Market Triggers</span>
                                </div>
                                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(stock.announcements_json?.data || stock.announcements_json) && (stock.announcements_json?.data || stock.announcements_json).length > 0 ? (
                                        (stock.announcements_json?.data || stock.announcements_json).map((ann, i) => (
                                            <div key={i} className="flex gap-3 items-start border-b border-gray-700/30 pb-2 last:border-0">
                                                <span className="text-[10px] font-mono text-gray-500 mt-0.5 shrink-0">{ann.date}</span>
                                                <span className="text-xs text-gray-300 font-medium leading-snug">{ann.title}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-gray-600 italic">No recent significant announcements.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Insights Box */}
                    <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
                        <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Core Insights
                        </h4>
                        <div className="text-sm text-gray-300 leading-relaxed space-y-2">
                            <p>
                                {stock.symbol} ({stock.company_name}) is a player in the <span className="text-blue-400 font-bold">{stock.sector}</span> sector. 
                                Currently traded as <span className="text-white font-bold">{stock.status}</span>, the company shows a 
                                cumulative dividend payout of <span className="text-yellow-400 font-bold">{stock.dividend_amount_ly}%</span> over the last financial year.
                            </p>
                            <p>
                                With an incorporation age of <span className="text-white font-bold">{age} years</span>, it holds membership in 
                                <span className="text-blue-300"> {stock.index_membership || 'general market'}</span> indices. Technical analysis suggests a 
                                performance score of <span className="text-emerald-400 font-bold">{latestAnalysis.recommendation_score}/100</span>.
                            </p>
                        </div>
                    </div>

                    {/* AI Disclaimer */}
                    {latestAnalysis.ai_disclaimer && (
                        <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-tighter">
                                <AlertCircle className="w-3 h-3" />
                                Financial Disclaimer
                            </div>
                            <p className="text-[10px] text-gray-600 leading-relaxed italic">
                                {latestAnalysis.ai_disclaimer}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50">
                    <button 
                        onClick={() => window.print()} 
                        className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-all border border-gray-700 flex items-center gap-2"
                    >
                        <BarChart3 className="w-4 h-4" />
                        Print Report
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockReport;
