import { useState, useEffect } from 'react';
import { Info, Filter, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';

interface CustomerItem {
    id: number;
    customer_ref_id: string;
    pic_name: string;
    business_name: string;
    status: string;
    activation_date: string;
    emails: string[];
    phones: string[];
    am_name: string;
}

export const CustomerSaya = () => {
    const [customers, setCustomers] = useState<CustomerItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const res = await api.get('/customers');
                setCustomers(res.data.customers || []);
            } catch (err) {
                console.error('Failed to fetch customers', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const renderBadge = (label: string) => {
        return (
            <span className="inline-flex items-center justify-center px-2 py-0.5 ml-2 text-xs font-medium bg-green-100 text-green-700 rounded cursor-pointer">
                {label} <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
        );
    };

    if (loading) {
        return <div className="w-full h-full flex items-center justify-center p-10"><span className="loading loading-spinner loading-lg text-green-600"></span></div>;
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    Pelanggan Saya <Info className="w-5 h-5 text-gray-400" />
                </h1>
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span className="text-green-600">Home</span> / <span>Pelanggan Saya</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 w-full overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <button className="btn btn-sm btn-outline text-gray-600 border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-green-600" /> Filter
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <input
                                type="text"
                                className="block w-64 pl-10 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                placeholder="Search"
                            />
                        </div>
                        <button className="text-green-600 hover:text-green-700">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="table w-full text-sm">
                        <thead className="bg-[#F9FAFB] text-gray-600 border-b border-gray-200">
                            <tr>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">ID Pelanggan <span className="text-gray-400 ml-1">↕</span></th>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Nama PIC <span className="text-gray-400 ml-1">↕</span></th>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Nama Bisnis <span className="text-gray-400 ml-1">↕</span></th>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Status <span className="text-gray-400 ml-1">↕</span></th>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Tanggal Aktif <span className="text-gray-400 ml-1">↕</span></th>
                                <th className="font-semibold whitespace-nowrap lg:w-[200px]">Email</th>
                                <th className="font-semibold whitespace-nowrap lg:w-[200px]">No Telpon</th>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Nama AM <span className="text-gray-400 ml-1">↕</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length > 0 ? (
                                customers.map((customer, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                                        <td className="py-3 text-green-600 font-medium cursor-pointer">{customer.customer_ref_id}</td>
                                        <td className="py-3 text-gray-700">{customer.pic_name}</td>
                                        <td className="py-3 text-gray-600 truncate max-w-[150px]">{customer.business_name}</td>
                                        <td className="py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-600">{new Date(customer.activation_date).toLocaleDateString('id-ID')}</td>
                                        <td className="py-3">
                                            <div className="flex items-center">
                                                <span className="text-gray-600 truncate max-w-[120px] inline-block" title={customer.emails[0]}>{customer.emails[0]}</span>
                                                {customer.emails.length > 1 && renderBadge('+' + (customer.emails.length - 1))}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center">
                                                <span className="text-gray-600">{customer.phones[0]}</span>
                                                {customer.phones.length > 1 && renderBadge('+' + (customer.phones.length - 1))}
                                            </div>
                                        </td>
                                        <td className="py-3 text-gray-600 truncate max-w-[120px]">{customer.am_name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-10 text-gray-500">Tidak ada data pelanggan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-[#F9FAFB]">
                    <span className="text-sm text-gray-500">Showing 1 to {customers.length} of {customers.length} entries</span>
                    <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-green-600 text-white text-sm font-medium">1</button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
