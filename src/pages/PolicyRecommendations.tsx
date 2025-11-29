import { useState } from 'react';
import { FileText, Search, CheckCircle, AlertCircle } from 'lucide-react';
import apiService, { PolicyRecommendation } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const COUNTRIES = [
  'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Egypt', 'Morocco', 'Tunisia',
  'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'Senegal', 'Ivory Coast',
  'Cameroon', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Mauritius',
];

const PolicyRecommendations = () => {
  const [selectedCountry, setSelectedCountry] = useState('Nigeria');
  const [recommendations, setRecommendations] = useState<PolicyRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRecommendations = async (country: string) => {
    setLoading(true);
    try {
      const response = await apiService.getPolicyRecommendations(country);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    fetchRecommendations(country);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-pink-50',
          border: 'border-red-300',
          badge: 'bg-red-100 text-red-700',
          icon: 'text-red-600',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
          border: 'border-yellow-300',
          badge: 'bg-yellow-100 text-yellow-700',
          icon: 'text-yellow-600',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          border: 'border-blue-300',
          badge: 'bg-blue-100 text-blue-700',
          icon: 'text-blue-600',
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    return FileText;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DEBT_MANAGEMENT':
        return 'text-red-600';
      case 'ECONOMIC_GROWTH':
        return 'text-green-600';
      case 'MONETARY_POLICY':
        return 'text-blue-600';
      case 'HUMAN_DEVELOPMENT':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Policy Recommendations
        </h1>
        <p className="text-gray-600 mt-1">AI-powered policy insights and recommendations</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
          {filteredCountries.map((country) => (
            <button
              key={country}
              onClick={() => handleCountrySelect(country)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCountry === country
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && recommendations.length === 0 && selectedCountry && (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-600">
            No critical policy recommendations for {selectedCountry} at this time.
            The country is performing well across key fiscal metrics.
          </p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{selectedCountry}</h2>
            <p className="text-indigo-100">
              {recommendations.length} policy{' '}
              {recommendations.length === 1 ? 'recommendation' : 'recommendations'} identified
            </p>
          </div>

          <div className="grid gap-6">
            {recommendations.map((rec, index) => {
              const colors = getPriorityColor(rec.priority);
              const Icon = getCategoryIcon(rec.category);
              const categoryColor = getCategoryColor(rec.category);

              return (
                <div
                  key={index}
                  className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <Icon className={categoryColor} size={24} />
                      </div>
                      <div>
                        <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-bold`}>
                          {rec.priority} PRIORITY
                        </span>
                        <h3 className="text-sm font-semibold text-gray-600 mt-1">
                          {rec.category.replace(/_/g, ' ')}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-3">{rec.recommendation}</h4>

                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      Recommended Actions:
                    </p>
                    <ul className="space-y-2">
                      {rec.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {actionIndex + 1}
                          </span>
                          <span className="text-gray-700 text-sm leading-relaxed">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && !selectedCountry && (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Country</h3>
          <p className="text-gray-600">
            Choose a country from the list above to view tailored policy recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default PolicyRecommendations;
