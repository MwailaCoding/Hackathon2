import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import apiService, { DebtSustainability as DebtData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DebtSustainability = () => {
  const [debtData, setDebtData] = useState<DebtData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSustainability, setFilterSustainability] = useState<string>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getDebtSustainabilityDashboard();
        setDebtData(response.data);
      } catch (error) {
        console.error('Error fetching debt sustainability data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSustainabilityColor = (status: string) => {
    switch (status) {
      case 'SUSTAINABLE':
        return {
          color: '#10b981',
          bg: 'bg-green-50',
          border: 'border-green-300',
          text: 'text-green-700',
        };
      case 'MODERATELY_SUSTAINABLE':
        return {
          color: '#3b82f6',
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          text: 'text-blue-700',
        };
      case 'AT_RISK':
        return {
          color: '#f59e0b',
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          text: 'text-orange-700',
        };
      case 'UNSUSTAINABLE':
        return {
          color: '#ef4444',
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-700',
        };
      default:
        return {
          color: '#6b7280',
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          text: 'text-gray-700',
        };
    }
  };

  const filteredData =
    filterSustainability === 'ALL'
      ? debtData
      : debtData.filter((d) => d.sustainability === filterSustainability);

  const sustainabilityCounts = {
    SUSTAINABLE: debtData.filter((d) => d.sustainability === 'SUSTAINABLE').length,
    MODERATELY_SUSTAINABLE: debtData.filter((d) => d.sustainability === 'MODERATELY_SUSTAINABLE')
      .length,
    AT_RISK: debtData.filter((d) => d.sustainability === 'AT_RISK').length,
    UNSUSTAINABLE: debtData.filter((d) => d.sustainability === 'UNSUSTAINABLE').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Debt Sustainability Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Comprehensive analysis of debt sustainability across African nations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Sustainable</p>
              <p className="text-4xl font-bold text-green-600">
                {sustainabilityCounts.SUSTAINABLE}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Moderately Sustainable</p>
              <p className="text-4xl font-bold text-blue-600">
                {sustainabilityCounts.MODERATELY_SUSTAINABLE}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">At Risk</p>
              <p className="text-4xl font-bold text-orange-600">{sustainabilityCounts.AT_RISK}</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-orange-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unsustainable</p>
              <p className="text-4xl font-bold text-red-600">
                {sustainabilityCounts.UNSUSTAINABLE}
              </p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Filter by Sustainability:</p>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'SUSTAINABLE', 'MODERATELY_SUSTAINABLE', 'AT_RISK', 'UNSUSTAINABLE'].map(
              (status) => {
                const colors = getSustainabilityColor(status);
                return (
                  <button
                    key={status}
                    onClick={() => setFilterSustainability(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterSustainability === status
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.replace(/_/g, ' ')}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Region</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Sustainability
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Debt Ratio</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Debt Service Ratio
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Growth Rate</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Primary Balance
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Fiscal Space
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data) => {
                const colors = getSustainabilityColor(data.sustainability);
                return (
                  <tr
                    key={data.country}
                    className={`border-b border-gray-100 hover:${colors.bg} transition-colors`}
                  >
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{data.country}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{data.region}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        {data.sustainability.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-red-600">{data.debt_ratio.toFixed(1)}%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-orange-600">
                        {data.debt_service_ratio.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-green-600">
                        {data.growth_rate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`font-semibold ${
                          data.primary_balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {data.primary_balance.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-blue-600">
                        {data.fiscal_space.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Debt Ratio vs Growth Rate</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                dataKey="debt_ratio"
                name="Debt Ratio"
                unit="%"
                tick={{ fontSize: 12 }}
                label={{ value: 'Debt Ratio (% of GDP)', position: 'bottom', offset: -5 }}
              />
              <YAxis
                type="number"
                dataKey="growth_rate"
                name="Growth Rate"
                unit="%"
                tick={{ fontSize: 12 }}
                label={{ value: 'GDP Growth Rate (%)', angle: -90, position: 'left' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const colors = getSustainabilityColor(data.sustainability);
                    return (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
                        <p className="font-semibold text-gray-900">{data.country}</p>
                        <p className="text-sm text-gray-600">
                          Debt: <span className="font-semibold">{data.debt_ratio.toFixed(1)}%</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Growth: <span className="font-semibold">{data.growth_rate.toFixed(1)}%</span>
                        </p>
                        <p className={`text-sm ${colors.text}`}>
                          Status: <span className="font-semibold">{data.sustainability}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {['SUSTAINABLE', 'MODERATELY_SUSTAINABLE', 'AT_RISK', 'UNSUSTAINABLE'].map(
                (status) => {
                  const colors = getSustainabilityColor(status);
                  return (
                    <Scatter
                      key={status}
                      name={status.replace(/_/g, ' ')}
                      data={debtData.filter((d) => d.sustainability === status)}
                      fill={colors.color}
                    >
                      {debtData
                        .filter((d) => d.sustainability === status)
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors.color} />
                        ))}
                    </Scatter>
                  );
                }
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Debt Service Ratio vs Fiscal Space</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                dataKey="debt_service_ratio"
                name="Debt Service"
                unit="%"
                tick={{ fontSize: 12 }}
                label={{ value: 'Debt Service Ratio (%)', position: 'bottom', offset: -5 }}
              />
              <YAxis
                type="number"
                dataKey="fiscal_space"
                name="Fiscal Space"
                tick={{ fontSize: 12 }}
                label={{ value: 'Fiscal Space Score', angle: -90, position: 'left' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const colors = getSustainabilityColor(data.sustainability);
                    return (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
                        <p className="font-semibold text-gray-900">{data.country}</p>
                        <p className="text-sm text-gray-600">
                          Debt Service:{' '}
                          <span className="font-semibold">{data.debt_service_ratio.toFixed(1)}%</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Fiscal Space:{' '}
                          <span className="font-semibold">{data.fiscal_space.toFixed(1)}</span>
                        </p>
                        <p className={`text-sm ${colors.text}`}>
                          Status: <span className="font-semibold">{data.sustainability}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {['SUSTAINABLE', 'MODERATELY_SUSTAINABLE', 'AT_RISK', 'UNSUSTAINABLE'].map(
                (status) => {
                  const colors = getSustainabilityColor(status);
                  return (
                    <Scatter
                      key={status}
                      name={status.replace(/_/g, ' ')}
                      data={debtData.filter((d) => d.sustainability === status)}
                      fill={colors.color}
                    >
                      {debtData
                        .filter((d) => d.sustainability === status)
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors.color} />
                        ))}
                    </Scatter>
                  );
                }
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Understanding Debt Sustainability
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold mb-2">Sustainability Categories:</p>
            <ul className="space-y-2 leading-relaxed">
              <li>
                <span className="text-green-600 font-semibold">Sustainable:</span> Debt &lt; 40%,
                Service &lt; 15%
              </li>
              <li>
                <span className="text-blue-600 font-semibold">Moderately Sustainable:</span> Debt
                &lt; 60%, Service &lt; 25%
              </li>
              <li>
                <span className="text-orange-600 font-semibold">At Risk:</span> Debt &lt; 80%
              </li>
              <li>
                <span className="text-red-600 font-semibold">Unsustainable:</span> Debt ≥ 80%
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Key Indicators:</p>
            <ul className="space-y-2 leading-relaxed">
              <li>
                <strong>Debt Ratio:</strong> Government debt as % of GDP
              </li>
              <li>
                <strong>Debt Service:</strong> Interest payments as % of revenue
              </li>
              <li>
                <strong>Growth Rate:</strong> Annual GDP growth percentage
              </li>
              <li>
                <strong>Primary Balance:</strong> Budget balance excluding interest
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtSustainability;
