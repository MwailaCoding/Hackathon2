import { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, Search } from 'lucide-react';
import apiService, { Warning } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EarlyWarning = () => {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await apiService.getEarlyWarnings();
        setWarnings(response.data.warnings);
      } catch (error) {
        console.error('Error fetching warnings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarnings();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-pink-50',
          border: 'border-red-300',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-700',
          icon: 'text-red-600',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
          border: 'border-yellow-300',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-700',
          icon: 'text-yellow-600',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          border: 'border-blue-300',
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-700',
          icon: 'text-blue-600',
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'DEBT_RISK':
        return 'Debt Risk';
      case 'INFLATION_RISK':
        return 'Inflation Risk';
      case 'FISCAL_RISK':
        return 'Fiscal Risk';
      default:
        return type;
    }
  };

  const filteredWarnings = warnings.filter((warning) => {
    const matchesSearch = warning.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      filterLevel === 'ALL' ||
      warning.warnings.some((w) => w.level === filterLevel);
    return matchesSearch && matchesLevel;
  });

  const highRiskCount = warnings.filter((w) =>
    w.warnings.some((warning) => warning.level === 'HIGH')
  ).length;
  const mediumRiskCount = warnings.filter((w) =>
    w.warnings.some((warning) => warning.level === 'MEDIUM')
  ).length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Early Warning System
        </h1>
        <p className="text-gray-600 mt-1">Real-time risk monitoring and alerts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">High Risk Countries</p>
              <p className="text-4xl font-bold text-red-600">{highRiskCount}</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Medium Risk Countries</p>
              <p className="text-4xl font-bold text-yellow-600">{mediumRiskCount}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-yellow-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Warnings</p>
              <p className="text-4xl font-bold text-blue-600">
                {warnings.reduce((acc, w) => acc + w.warnings.length, 0)}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-blue-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'HIGH', 'MEDIUM'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterLevel === level
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredWarnings.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">No warnings found</p>
            </div>
          ) : (
            filteredWarnings.map((warning) => (
              <div
                key={warning.country}
                className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{warning.country}</h3>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    {warning.warnings.length} {warning.warnings.length === 1 ? 'Warning' : 'Warnings'}
                  </span>
                </div>

                <div className="space-y-3">
                  {warning.warnings.map((w, index) => {
                    const colors = getLevelColor(w.level);
                    return (
                      <div
                        key={index}
                        className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 bg-white rounded-lg`}>
                            <AlertTriangle className={colors.icon} size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`${colors.badge} px-2 py-1 rounded text-xs font-bold`}>
                                {w.level}
                              </span>
                              <span className="text-sm font-semibold text-gray-700">
                                {getTypeLabel(w.type)}
                              </span>
                            </div>
                            <p className={`text-sm ${colors.text} font-medium`}>{w.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EarlyWarning;
