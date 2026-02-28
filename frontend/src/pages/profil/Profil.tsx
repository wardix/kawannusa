import { useState, useEffect } from 'react';
import { User, CreditCard, KeyRound, Mail, Phone, Edit2, Info, Save } from 'lucide-react';
import { api } from '../../lib/api';

export const Profil = () => {
    const [activeTab, setActiveTab] = useState('akun');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await api.get('/user/profile');
                setUser(res.data.user);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.put('/user/profile', user);
            // show success toast or similar here
        } catch (err) {
            console.error('Failed to save profile', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="w-full h-full flex items-center justify-center p-10"><span className="loading loading-spinner loading-lg text-green-600"></span></div>;
    }

    if (!user) {
        return <div className="w-full h-full flex items-center justify-center p-10 text-gray-500">Failed to load profile data</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto pb-10">

            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
                {/* Banner Area */}
                <div className="h-32 bg-blue-50 relative"></div>

                {/* Profile Info Area */}
                <div className="px-8 pb-8 flex flex-col sm:flex-row relative">

                    {/* Avatar (Overlapping banner) */}
                    <div className="absolute -top-16 align-top">
                        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                            <img
                                src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&size=256&background=0D8ABC&color=fff`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* User Details & Action */}
                    <div className="mt-20 sm:mt-4 sm:ml-36 flex-1 flex flex-col sm:flex-row sm:items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.first_name} {user.last_name}</h1>
                            <p className="text-gray-500 text-sm mt-1">Bergabung sejak {new Date(user.join_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700">
                                {user.referrer_rank}
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 flex gap-2">
                            <button className="btn btn-sm btn-outline text-gray-600 border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                                <Edit2 className="w-4 h-4" /> Ubah Foto
                            </button>
                            <button
                                className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none flex items-center gap-2"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? <span className="loading loading-spinner loading-xs"></span> : <Save className="w-4 h-4" />}
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-t border-gray-100 mt-4 px-8 justify-end gap-2 text-sm font-medium pt-2 pb-4 overflow-x-auto">
                    <button
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'akun' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('akun')}
                    >
                        <User className="w-4 h-4" /> Akun
                    </button>
                    <button
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'bank' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('bank')}
                    >
                        <CreditCard className="w-4 h-4" /> Bank dan Komisi
                    </button>
                    <button
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'password' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('password')}
                    >
                        <KeyRound className="w-4 h-4" /> Password
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Content Area (Forms) */}
                <div className="lg:col-span-2">

                    {/* Akun Tab Content */}
                    {activeTab === 'akun' && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Informasi Pribadi</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Depan<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full bg-gray-50 text-gray-700 h-10"
                                        value={user.first_name || ''}
                                        onChange={e => setUser({ ...user, first_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Belakang<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full bg-gray-50 text-gray-700 h-10"
                                        value={user.last_name || ''}
                                        onChange={e => setUser({ ...user, last_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Alamat Email<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            className="input input-bordered w-full pl-10 bg-gray-50 text-gray-700 h-10"
                                            value={user.email || ''}
                                            onChange={e => setUser({ ...user, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor Handphone<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full pl-10 bg-gray-50 text-gray-700 h-10"
                                            value={user.phone || ''}
                                            onChange={e => setUser({ ...user, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-lg font-bold text-gray-900 mb-6 mt-10">Informasi Perusahaan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Perusahaan<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full bg-gray-50 text-gray-700 h-10"
                                        value={user.company_name || ''}
                                        onChange={e => setUser({ ...user, company_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Jabatan<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full bg-gray-50 text-gray-700 h-10"
                                        value={user.job_title || ''}
                                        onChange={e => setUser({ ...user, job_title: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bank Tab Content */}
                    {activeTab === 'bank' && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Informasi Bank</h2>
                            </div>

                            <div className="flex items-center gap-3 p-4 mb-8 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 text-sm">
                                <Info className="w-5 h-5 text-blue-500 shrink-0" />
                                <p>Pastikan nama pemilik rekening sesuai dengan nama akun Anda.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Pemilik Rekening<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full bg-white text-gray-700 h-10"
                                        value={user.bank_account_name || ''}
                                        onChange={e => setUser({ ...user, bank_account_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Bank<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full bg-white text-gray-700 h-10 min-h-10"
                                        value={user.bank_name || ''}
                                        onChange={e => setUser({ ...user, bank_name: e.target.value })}
                                    >
                                        <option value="">Pilih Bank...</option>
                                        <option value="BCA">BCA</option>
                                        <option value="Mandiri">Mandiri</option>
                                        <option value="BNI">BNI</option>
                                        <option value="BRI">BRI</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor Rekening<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full bg-gray-50 text-gray-700 h-10"
                                        value={user.bank_account_number || ''}
                                        onChange={e => setUser({ ...user, bank_account_number: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Password Tab Content */}
                    {activeTab === 'password' && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Ubah Password</h2>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                                    <input type="password" className="input input-bordered w-full bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                                    <input type="password" className="input input-bordered w-full bg-white" />
                                </div>
                                <button className="btn btn-success bg-green-600 hover:bg-green-700 text-white mt-4 border-none">Simpan Password</button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Content Area (Preferences) */}
                <div className="lg:col-span-1 border border-gray-100 bg-white rounded-2xl p-6 h-fit">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Preferensi</h2>

                    <div className="space-y-4">
                        <div className="p-4 border border-gray-200 rounded-xl relative">
                            <div className="flex items-start gap-4 pr-12">
                                <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Update & Informasi Terbaru</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        Jika ini aktif, maka Anda akan menerima update setiap hari via email
                                    </p>
                                </div>
                            </div>
                            <div className="absolute right-4 top-4">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success toggle-sm"
                                    checked={!!user.pref_updates_enabled}
                                    onChange={e => setUser({ ...user, pref_updates_enabled: e.target.checked ? 1 : 0 })}
                                />
                            </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl relative">
                            <div className="flex items-start gap-4 pr-12">
                                <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center shrink-0">
                                    <span className="text-green-600 font-bold">$</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Penarikan Otomatis</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        Jika ini aktif, maka komisi Anda akan otomatis dikirimkan tanpa pengajuan penarikan
                                    </p>
                                </div>
                            </div>
                            <div className="absolute right-4 top-4">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success toggle-sm"
                                    checked={!!user.pref_auto_withdraw}
                                    onChange={e => setUser({ ...user, pref_auto_withdraw: e.target.checked ? 1 : 0 })}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
