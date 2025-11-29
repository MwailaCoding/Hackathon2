import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Globe,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService, { Overview } from '../services/api';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const Dashboard = () => {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getOverview();
        setOverview(response.data);
      } catch (error) {
        console.error('Error fetching overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!overview) return <div>Error loading data</div>;

  const regionalData = Object.entries(overview.regional_breakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const incomeData = Object.entries(overview.income_groups).map(([name, value]) => ({
    name,
    value,
  }));

  const metricsData = [
    {
      name: 'GDP Growth',
      value: overview.key_metrics.avg_gdp_growth,
    },
    {
      name: 'Debt/GDP',
      value: overview.key_metrics.avg_debt_gdp,
    },
    {
      name: 'Inflation',
      value: overview.key_metrics.avg_inflation,
    },
    {
      name: 'HDI',
      value: overview.key_metrics.avg_hdi * 100,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Overview Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive African fiscal data analysis for {overview.time_period}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Countries"
          value={overview.total_countries}
          subtitle="African nations analyzed"
          icon={Globe}
          color="text-blue-600"
        />
        <MetricCard
          title="Average GDP Growth"
          value={`${overview.key_metrics.avg_gdp_growth}%`}
          subtitle={`Year ${overview.latest_year}`}
          icon={TrendingUp}
          color="text-green-600"
          trend={{ value: 2.3, isPositive: true }}
        />
        <MetricCard
          title="Average Debt/GDP"
          value={`${overview.key_metrics.avg_debt_gdp}%`}
          subtitle="Government debt ratio"
          icon={DollarSign}
          color="text-red-600"
          trend={{ value: 1.5, isPositive: false }}
        />
        <MetricCard
          title="Average HDI"
          value={overview.key_metrics.avg_hdi.toFixed(3)}
          subtitle="Human Development Index"
          icon={Users}
          color="text-purple-600"
          trend={{ value: 0.8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            Key Economic Metrics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Globe className="text-green-600" />
            Regional Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionalData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {regionalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <DollarSign className="text-purple-600" />
            Income Group Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Quick Insights</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Economic Growth</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Average GDP growth of {overview.key_metrics.avg_gdp_growth}% indicates
                    moderate economic expansion across the continent.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Debt Levels</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Average debt-to-GDP ratio of {overview.key_metrics.avg_debt_gdp}% requires
                    careful fiscal management.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Human Development</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    HDI of {overview.key_metrics.avg_hdi.toFixed(3)} shows progress in education,
                    health, and living standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
