import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CountryAnalysis from './pages/CountryAnalysis';
import CompareCountries from './pages/CompareCountries';
import ClusterAnalysis from './pages/ClusterAnalysis';
import EarlyWarning from './pages/EarlyWarning';
import PolicyRecommendations from './pages/PolicyRecommendations';
import FiscalSpace from './pages/FiscalSpace';
import DebtSustainability from './pages/DebtSustainability';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/country" element={<CountryAnalysis />} />
          <Route path="/compare" element={<CompareCountries />} />
          <Route path="/clusters" element={<ClusterAnalysis />} />
          <Route path="/warnings" element={<EarlyWarning />} />
          <Route path="/recommendations" element={<PolicyRecommendations />} />
          <Route path="/fiscal-space" element={<FiscalSpace />} />
          <Route path="/debt-sustainability" element={<DebtSustainability />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
