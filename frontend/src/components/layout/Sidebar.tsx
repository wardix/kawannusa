import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Box, Coins, BookOpen } from 'lucide-react';

export const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Beranda', icon: Home, path: '/beranda' }, // Optional, not shown in requirements but exists in UI
        { name: 'Customer Saya', icon: Users, path: '/customer-saya' },
        { name: 'Produk dan Layanan', icon: Box, path: '/produk-layanan' },
        { name: 'Poin Saya', icon: Coins, path: '/poin-saya' }, // Changed from Komisi to Poin
    ];

    const bottomNavItems = [
        { name: 'Edukasi', icon: BookOpen, path: '/edukasi' },
    ];

    const renderNavItems = (items: typeof navItems) => (
        <ul className="menu p-0">
            {items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <li key={item.name} className="mb-1">
                        <Link
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            {item.name}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
            <div className="p-6">
                {/* Placeholder Logo */}
                <div className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-green-600">kawan</span>
                    <span className="text-gray-800">nusa</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Portal Referral PT Media Antar Nusa</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col justify-between">
                <div>
                    {renderNavItems(navItems)}
                </div>

                <div className="mt-8 pt-4">
                    {renderNavItems(bottomNavItems)}
                    <div className="px-4 py-4 mt-4 text-xs text-gray-400">
                        version: 2.1.0
                    </div>
                </div>
            </div>
        </div>
    );
};
