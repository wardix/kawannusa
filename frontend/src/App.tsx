import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PoinSaya } from './pages/poin-saya/PoinSaya';
import { CustomerSaya } from './pages/customer-saya/CustomerSaya';
import { ProdukLayanan } from './pages/produk-layanan/ProdukLayanan';
import { Profil } from './pages/profil/Profil';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/poin-saya" replace />} />
          <Route path="/poin-saya" element={<PoinSaya />} />
          <Route path="/customer-saya" element={<CustomerSaya />} />
          <Route path="/produk-layanan" element={<ProdukLayanan />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
