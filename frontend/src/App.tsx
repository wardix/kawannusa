import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PoinSaya } from './pages/poin-saya/PoinSaya';
import { CustomerSaya } from './pages/customer-saya/CustomerSaya';
import { ProdukLayanan } from './pages/produk-layanan/ProdukLayanan';
import { Profil } from './pages/profil/Profil';
import { Login } from './pages/auth/Login';
import { Beranda } from './pages/beranda/Beranda';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />

        <Route path="*" element={
          isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/beranda" replace />} />
                <Route path="/beranda" element={<Beranda />} />
                <Route path="/poin-saya" element={<PoinSaya />} />
                <Route path="/customer-saya" element={<CustomerSaya />} />
                <Route path="/produk-layanan" element={<ProdukLayanan />} />
                <Route path="/profil" element={<Profil />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
