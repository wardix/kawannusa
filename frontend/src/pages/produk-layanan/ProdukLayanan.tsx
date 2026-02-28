import { useState, useEffect } from 'react';
import { Info, Filter, Settings, ChevronLeft, ChevronRight, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

interface ProductItem {
    id: number;
    name: string;
    last_ref_date: string;
    total_points: number;
    total_customers: number;
    status: string; // Add derived status locally
}

export const ProdukLayanan = () => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await api.get('/products/summary');

                // Add a mock 'status' to the items for the UI
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const processedProducts = res.data.products.map((p: any) => ({
                    ...p,
                    status: 'Aktif' // Simplification
                }));

                setProducts(processedProducts);
            } catch (error) {
                console.error('Failed to fetch products data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="w-full h-full flex items-center justify-center p-10"><span className="loading loading-spinner loading-lg text-green-600"></span></div>;
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <Box className="w-6 h-6 text-gray-600" />
                    </div>
                    Produk dan Layanan <Info className="w-5 h-5 text-gray-400" />
                </h1>
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span className="text-green-600">Home</span> / <span>Produk dan Layanan</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 w-full overflow-hidden mt-6">
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
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Nama Layanan <span className="text-gray-400 ml-1">↕</span></th>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Referensi Terakhir <span className="text-gray-400 ml-1">↕</span></th>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Status Layanan <span className="text-gray-400 ml-1">↕</span></th>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Poin Didapatkan <span className="text-gray-400 ml-1">↕</span></th>
                                <th className="font-semibold cursor-pointer py-3 whitespace-nowrap">Pelanggan Anda <span className="text-gray-400 ml-1">↕</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                                        <td className="py-3 text-green-600 font-medium">{product.name}</td>
                                        <td className="py-3 text-gray-600">{new Date(product.last_ref_date).toLocaleDateString('id-ID')}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-medium min-w-[100px] ${product.status === 'Aktif'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-50 text-red-600'
                                                }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-600">{Number(product.total_points).toLocaleString('id-ID')}</td>
                                        <td className="py-3">
                                            <Link to="/customer-saya" className="text-green-600 hover:underline">{product.total_customers}</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">Tidak ada produk atau layanan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-[#F9FAFB]">
                    <span className="text-sm text-gray-500">Showing 1 to {products.length} of {products.length} entries</span>
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
