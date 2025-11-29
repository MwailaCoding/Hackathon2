import { useState, useEffect } from 'react';
import {
  Search,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Activity,
  BarChart3,
  Target,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import apiService, { CountryAnalysis } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import MetricCard from '../components/MetricCard';

const COUNTRIES = [
  'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Egypt', 'Morocco', 'Tunisia',
  'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'Senegal', 'Ivory Coast',
  'Cameroon', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Mauritius',
  'Algeria', 'Angola', 'Mozambique', 'Madagascar', 'Mali', 'Burkina Faso',
];

const CountryAnalysisPage = () => {
  const [selectedCountry, setSelectedCountry] = useState('Nigeria');
  const [analysis, setAnalysis] = useState<CountryAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!selectedCountry) return;
      setLoading(true);
      try {
        const response = await apiService.getCountryAnalysis(selectedCountry);
        setAnalysis(response.data);
      } catch (error) {
        console.error('Error fetching country analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [selectedCountry]);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const radarData = analysis
    ? [
        {
          metric: 'GDP Growth',
          value: Math.min(analysis.current_metrics.gdp_growth * 10, 100),
        },
        {
          metric: 'Fiscal Space',
          value: Math.max(0, analysis.current_metrics.fiscal_space * 5 + 50),
        },
        {
          metric: 'Debt Sust.',
          value: analysis.current_metrics.debt_sustainability,
        },
        {
          metric: 'HDI',
          value: analysis.current_metrics.hdi * 100,
        },
        {
          metric: 'Resilience',
          value: Math.min(analysis.current_metrics.economic_resilience, 100),
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Country Analysis
        </h1>
        <p className="text-gray-600 mt-1">Deep dive into country-specific fiscal metrics</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
          {filteredCountries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCountry === country
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && analysis && (
        <>
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{analysis.basic_info.country}</h2>
                <div className="flex items-center gap-4 mt-2 text-green-100">
                  <span>{analysis.basic_info.region}</span>
                  <span>•</span>
                  <span>{analysis.basic_info.income_group}</span>
                  <span>•</span>
                  <span>Year {analysis.basic_info.latest_year}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="GDP Growth"
              value={`${analysis.current_metrics.gdp_growth}%`}
              icon={TrendingUp}
              color="text-green-600"
              trend={
                analysis.trends.GDP_Growth
                  ? {
                      value: Math.abs(analysis.trends.GDP_Growth),
                      isPositive: analysis.trends.GDP_Growth > 0,
                    }
                  : undefined
              }
            />
            <MetricCard
              title="Government Debt"
              value={`${analysis.current_metrics.government_debt}%`}
              subtitle="of GDP"
              icon={DollarSign}
              color="text-red-600"
              trend={
                analysis.trends.Government_Debt_GDP
                  ? {
                      value: Math.abs(analysis.trends.Government_Debt_GDP),
                      isPositive: analysis.trends.Government_Debt_GDP < 0,
                    }
                  : undefined
              }
            />
            <MetricCard
              title="Inflation Rate"
              value={`${analysis.current_metrics.inflation}%`}
              icon={Activity}
              color="text-orange-600"
              trend={
                analysis.trends.Inflation
                  ? {
                      value: Math.abs(analysis.trends.Inflation),
                      isPositive: analysis.trends.Inflation < 0,
                    }
                  : undefined
              }
            />
            <MetricCard
              title="HDI Score"
              value={analysis.current_metrics.hdi.toFixed(3)}
              icon={Target}
              color="text-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="text-orange-600" />
                Risk Assessment
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Debt Risk</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(analysis.risk_assessment.debt_risk)}`}>
                      {analysis.risk_assessment.debt_risk}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Inflation Risk</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(analysis.risk_assessment.inflation_risk)}`}>
                      {analysis.risk_assessment.inflation_risk}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Fiscal Risk</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(analysis.risk_assessment.fiscal_risk)}`}>
                      {analysis.risk_assessment.fiscal_risk}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="text-blue-600" />
                Advanced Metrics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-sm text-gray-600">Fiscal Space</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {analysis.current_metrics.fiscal_space.toFixed(1)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
                  <p className="text-sm text-gray-600">Debt Sustainability</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {analysis.current_metrics.debt_sustainability.toFixed(0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <p className="text-sm text-gray-600">Economic Resilience</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {analysis.current_metrics.economic_resilience.toFixed(0)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" />
              Historical Trends
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analysis.historical_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="Year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="GDP_Growth"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="GDP Growth (%)"
                />
                <Line
                  type="monotone"
                  dataKey="Government_Debt_GDP"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  name="Debt/GDP (%)"
                />
                <Line
                  type="monotone"
                  dataKey="Inflation"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  name="Inflation (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {analysis.predictions && Object.keys(analysis.predictions).length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-purple-600" />
                Future Predictions (3-Year Forecast)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analysis.predictions).map(([metric, values]) => (
                  <div key={metric} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{metric.replace(/_/g, ' ')}</h4>
                    <div className="space-y-1">
                      {values.map((value: number, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">Year {index + 1}:</span>
                          <span className="font-semibold text-purple-600">{value.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CountryAnalysisPage;
