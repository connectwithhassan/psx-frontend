import React, { useState, useEffect } from 'react';
import { fetchRecommendations } from '../services/api';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import clsx from 'clsx';

const RecommendationCards = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchRecommendations();
                setRecommendations(response.data);
            } catch (error) {
                console.error("Error fetching recommendations", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="text-white">Loading recommendations...</div>;
    }

    if (recommendations.length === 0) {
        return <div className="text-gray-400">No recommendations available at the moment. Check back after market hours.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recommendations.map((rec, index) => (
                <div key={rec.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl relative overflow-hidden group hover:border-blue-500 transition-colors">
                    <div className="absolute top-0 right-0 p-4">
                        <span className={clsx("px-3 py-1 rounded-full text-xs font-bold",
                            index === 0 ? "bg-amber-500/20 text-amber-500" :
                                index === 1 ? "bg-slate-300/20 text-slate-300" :
                                    "bg-amber-700/20 text-amber-600"
                        )}>
                            #{index + 1} Pick
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1">{rec.stock_details?.symbol || 'Unknown'}</h3>
                    <p className="text-sm text-gray-400 mb-4">{rec.stock_details?.company_name || 'Details loading...'}</p>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Target Score</span>
                            <span className={clsx("font-bold text-lg", rec.recommendation_score > 60 ? "text-green-500" : "text-yellow-500")}>
                                {rec.recommendation_score.toFixed(1)}/100
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className={clsx("h-2 rounded-full", rec.recommendation_score > 60 ? "bg-green-500" : "bg-yellow-500")} style={{ width: `${rec.recommendation_score}%` }}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-xs text-gray-500">RSI (14)</p>
                            <p className={clsx("font-semibold", 
                                rec.rsi_14 === null ? "text-gray-400" :
                                rec.rsi_14 < 30 ? "text-green-400" : 
                                rec.rsi_14 > 70 ? "text-red-400" : "text-gray-300"
                            )}>
                                {rec.rsi_14 !== null && rec.rsi_14 !== undefined ? Number(rec.rsi_14).toFixed(2) : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">SMA (20)</p>
                            <p className="font-semibold text-gray-300">
                                {rec.sma_20 !== null && rec.sma_20 !== undefined ? `$${Number(rec.sma_20).toFixed(2)}` : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">MACD Line</p>
                            <p className="font-semibold text-gray-300">
                                {rec.macd !== null && rec.macd !== undefined ? (
                                    <span className={rec.macd > (rec.macd_signal || 0) ? "text-green-400" : "text-red-400"}>
                                        {Number(rec.macd).toFixed(2)}
                                    </span>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Stochastic (K%)</p>
                            <p className="font-semibold text-gray-300">
                                {rec.stoch_k !== null && rec.stoch_k !== undefined ? (
                                    <span className={rec.stoch_k < 20 ? "text-green-400" : rec.stoch_k > 80 ? "text-red-400" : ""}>
                                        {Number(rec.stoch_k).toFixed(2)}
                                    </span>
                                ) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                        <p className="text-sm text-gray-300 line-clamp-2">
                            <span className="text-blue-400 font-semibold text-xs uppercase tracking-wider block mb-1">AI Insight</span>
                            {rec.ai_advice}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecommendationCards;
