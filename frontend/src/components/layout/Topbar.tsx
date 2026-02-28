import { Search, HelpCircle, AlertCircle, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Topbar = () => {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex-1 flex max-w-2xl">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="Search"
                    />
                </div>
            </div>

            <div className="ml-4 flex items-center gap-4">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                    <HelpCircle className="w-6 h-6" />
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                    <AlertCircle className="w-6 h-6" />
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell className="w-6 h-6" />
                </button>

                <Link to="/profil" className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 hover:opacity-80 transition-opacity">
                    <img
                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                        src="https://ui-avatars.com/api/?name=Rupert+Alexander&background=0D8ABC&color=fff"
                        alt="User profile"
                    />
                    <span className="text-sm font-medium text-green-700 hidden md:block">Rupert Alexander</span>
                </Link>
            </div>
        </header>
    );
};
