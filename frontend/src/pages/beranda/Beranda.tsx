import { useState, useEffect } from 'react';
import { Users, Coins, Box, TrendingUp, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from '../../lib/api';

export const Beranda = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ totalCustomers: 0, totalActivePoints: 0, totalServices: 0 });
    const [chartData, setChartData] = useState<{ name: string, value: number }[]>([]);
    const [topServices, setTopServices] = useState<any[]>([]);
    const [resentCustomers, setResentCustomers] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/dashboard/summary');
                const data = res.data;
                setMetrics(data.metrics);
                setChartData(data.chartData);
                setTopServices(data.topServices);
                setResentCustomers(data.recentCustomers);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="p-8 flex justify-center"><span className="loading loading-spinner text-green-600"></span></div>;
    }

    return (
        <div className="w-full max-w-[1200px]">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Selamat Datang, Rupert 👋
                </h1>
                <p className="text-sm text-gray-500 mt-1">Berikut adalah ringkasan aktivitas referral Anda</p>
            </div>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-500">Total Pelanggan</span>
                        <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{metrics.totalCustomers}</div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium mr-1">+ 12%</span> dari bulan lalu
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-500">Total Poin Aktif</span>
                        <Coins className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{metrics.totalActivePoints}</div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium mr-1">+ 12%</span> dari bulan lalu
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-500">Layanan Direferensikan</span>
                        <Box className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{metrics.totalServices}</div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium mr-1">+ 12%</span> dari bulan lalu
                    </div>
                </div>
            </div>

            {/* Middle Section: Chart & Top Services */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* Line Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Pertumbuhan Pelanggan</h2>
                            <p className="text-xs text-gray-500 mt-1">Grafik pertumbuhan pelanggan bulan ini</p>
                        </div>
                        <select className="select select-sm select-bordered bg-white text-gray-700 min-h-8 h-8 rounded-lg shadow-sm">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    ticks={[0, 8, 16, 24, 32, 40, 48]}
                                    domain={[0, 48]}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="linear"
                                    dataKey="value"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={{ r: 4, stroke: '#22c55e', strokeWidth: 2, fill: 'white' }}
                                    activeDot={{ r: 6, fill: '#22c55e', stroke: 'white', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Services List Area */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Layanan Teratas</h2>
                            <p className="text-xs text-gray-500 mt-1">Berdasarkan total poin yang diperoleh</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex-1 space-y-4">
                        {topServices.map((service) => (
                            <div key={service.rank} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${service.rank === 1 ? 'bg-green-800 text-white' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {service.rank}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[130px] sm:max-w-[160px] pb-0.5" title={service.name}>{service.name}</h3>
                                        <p className="text-xs text-gray-500">{service.customers} Pelanggan</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-green-600">{service.points}</div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Poin</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Table Area */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5 flex justify-between items-center border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Pelanggan Terbaru</h2>
                        <p className="text-xs text-gray-500 mt-1">Daftar pelanggan yang baru terdaftar</p>
                    </div>
                    <Link to="/customer-saya" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
                        Lihat Semua <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F9FAFB] text-gray-600 border-b border-gray-100">
                            <tr>
                                <th className="font-semibold py-3 px-5">ID Pelanggan <span className="text-gray-400 text-xs ml-1">↕</span></th>
                                <th className="font-semibold py-3 px-5">Tanggal Registrasi <span className="text-gray-400 text-xs ml-1">↕</span></th>
                                <th className="font-semibold py-3 px-5">Pembayaran Terakhir <span className="text-gray-400 text-xs ml-1">↕</span></th>
                                <th className="font-semibold py-3 px-5">Periode Berlangganan <span className="text-gray-400 text-xs ml-1">↕</span></th>
                                <th className="font-semibold py-3 px-5">Status <span className="text-gray-400 text-xs ml-1">↕</span></th>
                                <th className="font-semibold py-3 px-5">Nama AM <span className="text-gray-400 text-xs ml-1">↕</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {resentCustomers.map((cust) => (
                                <tr key={cust.id} className="hover:bg-gray-50/50">
                                    <td className="py-3 px-5 text-green-600 cursor-pointer">{cust.id}</td>
                                    <td className="py-3 px-5 text-gray-600">{cust.regDate}</td>
                                    <td className="py-3 px-5 text-gray-600">{cust.payDate}</td>
                                    <td className="py-3 px-5 text-gray-600">{cust.period}</td>
                                    <td className="py-3 px-5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-600 border border-green-100">
                                            {cust.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5 text-gray-600">{cust.am}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Detail Section */}
                <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <div>Showing 1 to 5 of 5 entries</div>
                    <div className="flex items-center gap-1">
                        <button className="p-1 px-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"><ChevronLeft className="w-4 h-4 inline" /> |&lt;</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-green-600 text-white text-xs font-medium">1</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 text-xs font-medium">2</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 text-xs font-medium">3</button>
                        <button className="p-1 px-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">&gt;| <ChevronRight className="w-4 h-4 inline" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
