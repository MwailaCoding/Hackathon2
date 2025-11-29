import { useEffect, useState } from 'react';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import apiService, { FiscalSpace as FiscalSpaceData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const FiscalSpace = () => {
  const [fiscalData, setFiscalData] = useState<FiscalSpaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'revenue' | 'debt'>('score');
  const [filterRegion, setFilterRegion] = useState<string>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getFiscalSpaceAnalysis();
        setFiscalData(response.data);
      } catch (error) {
        console.error('Error fetching fiscal space data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score > 10) return '#10b981';
    if (score > 0) return '#f59e0b';
    return '#ef4444';
  };

  const regions = ['ALL', ...Array.from(new Set(fiscalData.map((d) => d.Region)))];

  const filteredData = fiscalData.filter(
    (d) => filterRegion === 'ALL' || d.Region === filterRegion
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.Fiscal_Space_Score - a.Fiscal_Space_Score;
      case 'revenue':
        return b.Revenue_GDP - a.Revenue_GDP;
      case 'debt':
        return a.Government_Debt_GDP - b.Government_Debt_GDP;
      default:
        return 0;
    }
  });

  const topPerformers = sortedData.slice(0, 10);
  const avgScore =
    filteredData.reduce((acc, d) => acc + d.Fiscal_Space_Score, 0) / filteredData.length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Fiscal Space Analysis
        </h1>
        <p className="text-gray-600 mt-1">
          Measure of government's financial flexibility and capacity for policy action
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Fiscal Space</p>
              <p className="text-4xl font-bold text-teal-600">{avgScore.toFixed(1)}</p>
            </div>
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-teal-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Positive Space Countries</p>
              <p className="text-4xl font-bold text-green-600">
                {filteredData.filter((d) => d.Fiscal_Space_Score > 0).length}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowUp className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Constrained Countries</p>
              <p className="text-4xl font-bold text-red-600">
                {filteredData.filter((d) => d.Fiscal_Space_Score <= 0).length}
              </p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <ArrowDown className="text-red-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Sort By:</p>
            <div className="flex gap-2">
              {[
                { value: 'score', label: 'Fiscal Space' },
                { value: 'revenue', label: 'Revenue' },
                { value: 'debt', label: 'Debt' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === option.value
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">Filter by Region:</p>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Region</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Fiscal Space Score
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Revenue/GDP
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Expenditure/GDP
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Debt/GDP</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((data, index) => (
                <tr
                  key={data.Country}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-700">#{index + 1}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">{data.Country}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{data.Region}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: `${getScoreColor(data.Fiscal_Space_Score)}20`,
                        color: getScoreColor(data.Fiscal_Space_Score),
                      }}
                    >
                      {data.Fiscal_Space_Score.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-blue-600">
                      {data.Revenue_GDP.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-orange-600">
                      {data.Total_Expenditure_GDP.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-red-600">
                      {data.Government_Debt_GDP.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-teal-600" />
          Top 10 Performers - Fiscal Space Score
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topPerformers} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="Country" type="category" tick={{ fontSize: 11 }} width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="Fiscal_Space_Score" radius={[0, 8, 8, 0]}>
              {topPerformers.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getScoreColor(entry.Fiscal_Space_Score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Understanding Fiscal Space</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold mb-2">What is Fiscal Space?</p>
            <p className="leading-relaxed">
              Fiscal space measures a government's financial flexibility to pursue policies without
              compromising fiscal sustainability. It considers revenue capacity, expenditure needs,
              debt levels, and economic growth.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Score Interpretation:</p>
            <ul className="space-y-1 leading-relaxed">
              <li>
                <span className="text-green-600 font-semibold">&gt; 10:</span> Strong fiscal space
              </li>
              <li>
                <span className="text-yellow-600 font-semibold">0 to 10:</span> Moderate fiscal
                space
              </li>
              <li>
                <span className="text-red-600 font-semibold">&lt; 0:</span> Constrained fiscal
                space
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiscalSpace;
