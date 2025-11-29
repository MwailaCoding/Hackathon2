import { useState } from 'react';
import { GitCompare, Plus, X } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const COUNTRIES = [
  'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Egypt', 'Morocco', 'Tunisia',
  'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'Senegal', 'Ivory Coast',
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const CompareCountries = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['Nigeria', 'Kenya']);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const addCountry = (country: string) => {
    if (!selectedCountries.includes(country) && selectedCountries.length < 5) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const removeCountry = (country: string) => {
    setSelectedCountries(selectedCountries.filter((c) => c !== country));
  };

  const compareCountries = async () => {
    if (selectedCountries.length < 2) {
      alert('Please select at least two countries to compare.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.compareCountries(selectedCountries);
      if (!response.data || !response.data.countries) {
        alert('No data available for the selected countries.');
        return;
      }
      setComparisonData(response.data);
    } catch (error) {
      console.error('Error comparing countries:', error);
      alert('An error occurred while fetching comparison data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const radarData = comparisonData
    ? [
        {
          metric: 'GDP Growth',
          ...Object.fromEntries(
            Object.entries(comparisonData.countries).map(([country, data]: [string, any]) => [
              country,
              Math.abs(data.gdp_growth * 10),
            ])
          ),
        },
        {
          metric: 'Revenue/GDP',
          ...Object.fromEntries(
            Object.entries(comparisonData.countries).map(([country, data]: [string, any]) => [
              country,
              data.revenue_gdp,
            ])
          ),
        },
        {
          metric: 'HDI',
          ...Object.fromEntries(
            Object.entries(comparisonData.countries).map(([country, data]: [string, any]) => [
              country,
              data.hdi * 100,
            ])
          ),
        },
        {
          metric: 'Debt Sustainability',
          ...Object.fromEntries(
            Object.entries(comparisonData.countries).map(([country, data]: [string, any]) => [
              country,
              data.debt_sustainability,
            ])
          ),
        },
        {
          metric: 'Budget Balance',
          ...Object.fromEntries(
            Object.entries(comparisonData.countries).map(([country, data]: [string, any]) => [
              country,
              Math.max(0, data.budget_balance + 20) * 3,
            ])
          ),
        },
      ]
    : [];

  const metricsComparison = comparisonData
    ? [
        {
          metric: 'GDP Growth',
          ...Object.fromEntries(
            Object.entries(comparisonData.countries).map(([country, data]: [string, any]) => [
              country,
              data.gdp_growth,
            ])
          ),
        },
        {
          metric: 'Debt/GDP',
          ...Object.fromEntries(
            Object.entries(comparisonData.countries).map(([country, data]: [string, any]) => [
              country,
              data.government_debt,
            ])
          ),
        },
        {
          metric: 'Inflation',
          ...Object.fromEntries(
            Object.entries(comparisonData.countries).map(([country, data]: [string, any]) => [
              country,
              data.inflation,
            ])
          ),
        },
        {
          metric: 'Budget Balance',
          ...Object.fromEntries(
            Object.entries(comparisonData.countries).map(([country, data]: [string, any]) => [
              country,
              data.budget_balance,
            ])
          ),
        },
      ]
    : [];

  // Enhance chart presentation
  const chartTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const chartLegendStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#374151',
  };

  const chartAxisStyle = {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Compare Countries
        </h1>
        <p className="text-gray-600 mt-1">Side-by-side comparison of fiscal metrics</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Selected Countries ({selectedCountries.length}/5)</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCountries.map((country) => (
            <div
              key={country}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
            >
              <span className="font-medium">{country}</span>
              <button
                onClick={() => removeCountry(country)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
          {COUNTRIES.filter((c) => !selectedCountries.includes(c)).map((country) => (
            <button
              key={country}
              onClick={() => addCountry(country)}
              disabled={selectedCountries.length >= 5}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <Plus size={16} />
              {country}
            </button>
          ))}
        </div>

        <button
          onClick={compareCountries}
          disabled={selectedCountries.length < 2 || loading}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <GitCompare size={20} />
          Compare Countries
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && comparisonData && (
        <>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Comparison Overview</h3>
            <p className="text-gray-600 mb-4">Data as of year {comparisonData.comparison_year}</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                    {Object.keys(comparisonData.countries).map((country, index) => (
                      <th
                        key={country}
                        className="text-center py-3 px-4 font-semibold"
                        style={{ color: COLORS[index % COLORS.length] }}
                      >
                        {country}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">GDP Growth</td>
                    {Object.values(comparisonData.countries).map((data: any, index) => (
                      <td key={index} className="text-center py-3 px-4">
                        <span className="font-semibold text-green-600">{data.gdp_growth}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">Government Debt</td>
                    {Object.values(comparisonData.countries).map((data: any, index) => (
                      <td key={index} className="text-center py-3 px-4">
                        <span className="font-semibold text-red-600">{data.government_debt}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">Inflation</td>
                    {Object.values(comparisonData.countries).map((data: any, index) => (
                      <td key={index} className="text-center py-3 px-4">
                        <span className="font-semibold text-orange-600">{data.inflation}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">Budget Balance</td>
                    {Object.values(comparisonData.countries).map((data: any, index) => (
                      <td key={index} className="text-center py-3 px-4">
                        <span className={`font-semibold ${data.budget_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.budget_balance}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">HDI</td>
                    {Object.values(comparisonData.countries).map((data: any, index) => (
                      <td key={index} className="text-center py-3 px-4">
                        <span className="font-semibold text-purple-600">{data.hdi}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">Debt Sustainability</td>
                    {Object.values(comparisonData.countries).map((data: any, index) => (
                      <td key={index} className="text-center py-3 px-4">
                        <span className="font-semibold text-blue-600">{data.debt_sustainability}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">Region</td>
                    {Object.values(comparisonData.countries).map((data: any, index) => (
                      <td key={index} className="text-center py-3 px-4">
                        <span className="text-sm text-gray-600">{data.region}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">Income Group</td>
                    {Object.values(comparisonData.countries).map((data: any, index) => (
                      <td key={index} className="text-center py-3 px-4">
                        <span className="text-sm text-gray-600">{data.income_group}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Performance Radar</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={chartAxisStyle} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={chartAxisStyle} />
                  {Object.keys(comparisonData.countries).map((country, index) => (
                    <Radar
                      key={country}
                      name={country}
                      dataKey={country}
                      stroke={COLORS[index % COLORS.length]}
                      fill={COLORS[index % COLORS.length]}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend wrapperStyle={chartLegendStyle} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Key Metrics Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={metricsComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="metric" tick={chartAxisStyle} />
                  <YAxis tick={chartAxisStyle} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={chartLegendStyle} />
                  {Object.keys(comparisonData.countries).map((country, index) => (
                    <Bar
                      key={country}
                      dataKey={country}
                      fill={COLORS[index % COLORS.length]}
                      radius={[8, 8, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompareCountries;
