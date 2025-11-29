import { useEffect, useState } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import apiService, { ClusterAnalysis as ClusterData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CLUSTER_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const ClusterAnalysis = () => {
  const [clusters, setClusters] = useState<ClusterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await apiService.getClusterAnalysis();
        setClusters(response.data);
      } catch (error) {
        console.error('Error fetching cluster analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!clusters) return <div>Error loading cluster data</div>;

  const scatterData = Object.entries(clusters).flatMap(([clusterId, cluster]) =>
    cluster.countries.map((country) => ({
      country,
      clusterId: parseInt(clusterId),
      gdpGrowth: cluster.characteristics.avg_gdp_growth,
      debt: cluster.characteristics.avg_debt,
      inflation: cluster.characteristics.avg_inflation,
      hdi: cluster.characteristics.avg_hdi,
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Cluster Analysis
        </h1>
        <p className="text-gray-600 mt-1">
          Countries grouped by similar economic characteristics using machine learning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(clusters).map(([clusterId, cluster]) => {
          const id = parseInt(clusterId);
          const isSelected = selectedCluster === id;
          return (
            <div
              key={clusterId}
              onClick={() => setSelectedCluster(isSelected ? null : id)}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                isSelected ? 'border-orange-500 shadow-xl' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${CLUSTER_COLORS[id]}20` }}
                >
                  <Users size={24} style={{ color: CLUSTER_COLORS[id] }} />
                </div>
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: `${CLUSTER_COLORS[id]}20`,
                    color: CLUSTER_COLORS[id],
                  }}
                >
                  {cluster.size} countries
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: CLUSTER_COLORS[id] }}>
                Cluster {parseInt(clusterId) + 1}
              </h3>
              <p className="text-sm text-gray-600 mb-4 font-medium">{cluster.label}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg GDP Growth:</span>
                  <span className="font-semibold text-green-600">
                    {cluster.characteristics.avg_gdp_growth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Debt:</span>
                  <span className="font-semibold text-red-600">
                    {cluster.characteristics.avg_debt.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Inflation:</span>
                  <span className="font-semibold text-orange-600">
                    {cluster.characteristics.avg_inflation.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg HDI:</span>
                  <span className="font-semibold text-purple-600">
                    {cluster.characteristics.avg_hdi.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCluster !== null && clusters[selectedCluster] && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4">
            Countries in Cluster {selectedCluster + 1}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {clusters[selectedCluster].countries.map((country) => (
              <div
                key={country}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white text-center"
                style={{ backgroundColor: CLUSTER_COLORS[selectedCluster] }}
              >
                {country}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-orange-600" />
          GDP Growth vs Debt Ratio
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="debt"
              name="Government Debt"
              unit="%"
              tick={{ fontSize: 12 }}
              label={{ value: 'Government Debt (% of GDP)', position: 'bottom', offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="gdpGrowth"
              name="GDP Growth"
              unit="%"
              tick={{ fontSize: 12 }}
              label={{ value: 'GDP Growth (%)', angle: -90, position: 'left' }}
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
                  return (
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
                      <p className="font-semibold text-gray-900">{data.country}</p>
                      <p className="text-sm text-gray-600">
                        GDP Growth: <span className="font-semibold">{data.gdpGrowth.toFixed(1)}%</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Debt: <span className="font-semibold">{data.debt.toFixed(1)}%</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Cluster: <span className="font-semibold">{data.clusterId + 1}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {[0, 1, 2, 3].map((clusterId) => (
              <Scatter
                key={clusterId}
                name={`Cluster ${clusterId + 1}`}
                data={scatterData.filter((d) => d.clusterId === clusterId)}
                fill={CLUSTER_COLORS[clusterId]}
              >
                {scatterData
                  .filter((d) => d.clusterId === clusterId)
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[clusterId]} />
                  ))}
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-600" />
          HDI vs Inflation
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="inflation"
              name="Inflation"
              unit="%"
              tick={{ fontSize: 12 }}
              label={{ value: 'Inflation (%)', position: 'bottom', offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="hdi"
              name="HDI"
              tick={{ fontSize: 12 }}
              label={{ value: 'Human Development Index', angle: -90, position: 'left' }}
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
                  return (
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
                      <p className="font-semibold text-gray-900">{data.country}</p>
                      <p className="text-sm text-gray-600">
                        HDI: <span className="font-semibold">{data.hdi.toFixed(3)}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Inflation: <span className="font-semibold">{data.inflation.toFixed(1)}%</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Cluster: <span className="font-semibold">{data.clusterId + 1}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {[0, 1, 2, 3].map((clusterId) => (
              <Scatter
                key={clusterId}
                name={`Cluster ${clusterId + 1}`}
                data={scatterData.filter((d) => d.clusterId === clusterId)}
                fill={CLUSTER_COLORS[clusterId]}
              >
                {scatterData
                  .filter((d) => d.clusterId === clusterId)
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[clusterId]} />
                  ))}
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClusterAnalysis;
