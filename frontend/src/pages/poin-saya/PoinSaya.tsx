import { useState, useEffect } from 'react';
import { Info, Coins } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../lib/api';

interface PointHistoryItem {
    id: number;
    points_awarded: number;
    status: string;
    transaction_date: string;
    pic_name: string;
    customer_ref_id: string;
    service_name: string;
}

export const PoinSaya = () => {
    const [activeTab, setActiveTab] = useState('MASUK');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [chartData, setChartData] = useState<any[]>([]);
    const [summary, setSummary] = useState({ total_active: 0, total_withdrawn: 0 });
    const [history, setHistory] = useState<PointHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPointsData = async () => {
            try {
                setLoading(true);
                const [chartRes, summaryRes, historyRes] = await Promise.all([
                    api.get('/points/chart-data'),
                    api.get('/points/summary'),
                    api.get('/points/history')
                ]);

                setChartData(chartRes.data.data);
                setSummary(summaryRes.data.summary || { total_active: 0, total_withdrawn: 0 });
                setHistory(historyRes.data.history);
            } catch (error) {
                console.error('Failed to fetch points data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPointsData();
    }, []);

    const filteredHistory = history.filter(item => item.status === activeTab);

    if (loading) {
        return <div className="w-full h-full flex items-center justify-center p-10"><span className="loading loading-spinner loading-lg text-green-600"></span></div>;
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    Poin Saya <Info className="w-5 h-5 text-gray-400" />
                </h1>
                <p className="text-sm text-gray-500 mt-1">Kelola dan pantau semua pergerakan poin komisi Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                    <div className="h-[300px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(value: any) => [`${value} Pts`, 'Points']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#16A34A"
                                        strokeWidth={3}
                                        fill="url(#colorValue)"
                                        activeDot={{ r: 6, fill: '#16A34A', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">Tidak ada data grafik</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 text-gray-600 mb-2 font-medium">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <Coins className="w-3 h-3 text-green-600" />
                        </div>
                        Total Poin Aktif
                    </div>

                    <div className="flex items-end gap-2 mb-6">
                        <span className="text-4xl font-bold text-gray-900">{Number(summary.total_active).toLocaleString('id-ID')}</span>
                        <div className="tooltip tooltip-bottom" data-tip="Jumlah poin yang anda hasilkan akan diperbaharui pada tanggal 15 setiap bulannya.">
                            <Info className="w-5 h-5 text-gray-400 mb-1 cursor-pointer hover:text-green-600 transition-colors" />
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Poin Ditarik</span>
                            <span className="font-medium text-gray-900">{Number(summary.total_withdrawn).toLocaleString('id-ID')}</span>
                        </div>
                        <button className="btn btn-success bg-green-600 hover:bg-green-700 text-white w-full border-none rounded-lg">
                            Tarik Poin
                        </button>
                    </div>
                </div>
            </div>

            {/* Table section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="tabs tabs-bordered mb-6">
                    <button
                        className={`tab ${activeTab === 'MASUK' ? 'tab-active text-green-600 border-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('MASUK')}
                    >
                        Poin Masuk
                    </button>
                    <button
                        className={`tab ${activeTab === 'DITARIK' ? 'tab-active text-green-600 border-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('DITARIK')}
                    >
                        Sudah Ditarik
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full text-sm">
                        <thead className="bg-[#F9FAFB] text-gray-600 border-b border-gray-200">
                            <tr>
                                <th className="font-semibold py-3">Tanggal</th>
                                <th className="font-semibold py-3">Layanan</th>
                                <th className="font-semibold py-3">Pelanggan</th>
                                <th className="font-semibold py-3">Status</th>
                                <th className="font-semibold py-3 text-right">Poin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                                        <td className="py-3 text-gray-600">{new Date(item.transaction_date).toLocaleDateString('id-ID')}</td>
                                        <td className="py-3 text-gray-800 font-medium">{item.service_name}</td>
                                        <td className="py-3">
                                            <div className="text-gray-800">{item.pic_name}</div>
                                            <div className="text-xs text-gray-500">{item.customer_ref_id}</div>
                                        </td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'MASUK' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right font-medium text-green-600">
                                            {item.status === 'MASUK' ? '+' : '-'}{Number(item.points_awarded).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">Tidak ada data riwayat poin.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
