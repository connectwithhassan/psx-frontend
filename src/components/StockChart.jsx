import React, { useState, useEffect } from 'react';
import { fetchStocks, fetchStockHistory } from '../services/api';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import clsx from 'clsx';

const StockChart = ({ symbol, defaultData = null }) => {
    const [data, setData] = useState(defaultData || []);
    const [loading, setLoading] = useState(!defaultData);
    const [timeRange, setTimeRange] = useState('1M'); // 1M, 3M, 6M, 1Y

    useEffect(() => {
        if (defaultData) {
            setData(defaultData);
            setLoading(false);
            return;
        }

        if (!symbol) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const response = await fetchStockHistory(symbol);
                // Reverse to ensure chronological order for charts
                const sortedData = [...response.data].reverse();
                setData(sortedData);
            } catch (error) {
                console.error(`Error fetching history for ${symbol}`, error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [symbol, defaultData]);

    // Filter based on time range (mock implementation)
    const filteredData = data.slice(
        timeRange === '1M' ? -30 :
            timeRange === '3M' ? -90 :
                timeRange === '6M' ? -180 : 0
    );

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center bg-gray-800 rounded-xl border border-gray-700 animate-pulse">
                <span className="text-gray-400">Loading chart data...</span>
            </div>
        );
    }

    if (filteredData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-gray-800 rounded-xl border border-gray-700">
                <span className="text-gray-500">No chart data available</span>
            </div>
        );
    }

    const latestPrice = filteredData[filteredData.length - 1]?.close_price;
    const firstPrice = filteredData[0]?.close_price;
    const isPositive = latestPrice >= firstPrice;

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">{symbol} Price History</h3>
                    <p className={clsx("text-sm font-semibold", isPositive ? "text-green-400" : "text-red-400")}>
                        {isPositive ? '+' : ''}{((latestPrice - firstPrice) / firstPrice * 100).toFixed(2)}% ({timeRange})
                    </p>
                </div>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
                    {['1M', '3M', '6M', '1Y'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={clsx(
                                "px-3 py-1 text-xs font-semibold rounded-md transition-colors",
                                timeRange === range ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickFormatter={(date) => {
                                const d = new Date(date);
                                return `${d.getMonth() + 1}/${d.getDate()}`;
                            }}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            domain={['auto', 'auto']}
                            tickFormatter={(val) => `$${val}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                            itemStyle={{ color: '#60A5FA' }}
                            labelFormatter={(label) => new Date(label).toDateString()}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            name="Close Price"
                            dataKey="close_price"
                            stroke={isPositive ? "#10B981" : "#EF4444"}
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: isPositive ? "#10B981" : "#EF4444", stroke: '#1F2937', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StockChart;
