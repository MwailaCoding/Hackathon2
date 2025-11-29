import axios from 'axios';

const API_BASE_URL = 'https://hackathon-1-boow.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Overview {
  total_countries: number;
  time_period: string;
  latest_year: number;
  key_metrics: {
    avg_gdp_growth: number;
    avg_debt_gdp: number;
    avg_inflation: number;
    avg_hdi: number;
  };
  regional_breakdown: Record<string, number>;
  income_groups: Record<string, number>;
}

export interface CountryAnalysis {
  basic_info: {
    country: string;
    region: string;
    income_group: string;
    latest_year: number;
  };
  current_metrics: {
    gdp_growth: number;
    government_debt: number;
    inflation: number;
    budget_balance: number;
    revenue_gdp: number;
    hdi: number;
    fiscal_space: number;
    debt_sustainability: number;
    economic_resilience: number;
  };
  trends: Record<string, number>;
  risk_assessment: {
    debt_risk: string;
    inflation_risk: string;
    fiscal_risk: string;
  };
  predictions: Record<string, number[]>;
  historical_data: Array<{
    Year: number;
    GDP_Growth: number;
    Government_Debt_GDP: number;
    Inflation: number;
  }>;
}

export interface ClusterAnalysis {
  [key: string]: {
    size: number;
    countries: string[];
    characteristics: {
      avg_gdp_growth: number;
      avg_debt: number;
      avg_inflation: number;
      avg_hdi: number;
    };
    label: string;
  };
}

export interface Warning {
  country: string;
  warnings: Array<{
    type: string;
    level: string;
    message: string;
  }>;
}

export interface PolicyRecommendation {
  category: string;
  priority: string;
  recommendation: string;
  actions: string[];
}

export interface FiscalSpace {
  Country: string;
  Region: string;
  Fiscal_Space_Score: number;
  Revenue_GDP: number;
  Total_Expenditure_GDP: number;
  Government_Debt_GDP: number;
}

export interface DebtSustainability {
  country: string;
  region: string;
  debt_ratio: number;
  debt_service_ratio: number;
  growth_rate: number;
  primary_balance: number;
  sustainability: string;
  fiscal_space: number;
}

export const apiService = {
  getOverview: () => api.get<Overview>('/overview'),

  getCountryAnalysis: (country: string) =>
    api.get<CountryAnalysis>(`/country/${encodeURIComponent(country)}`),

  compareCountries: (countries: string[]) =>
    api.get('/compare', { params: { countries } }),

  getClusterAnalysis: () =>
    api.get<ClusterAnalysis>('/cluster-analysis'),

  getEarlyWarnings: () =>
    api.get<{ warnings: Warning[] }>('/early-warning'),

  getPolicyRecommendations: (country: string) =>
    api.get<{ country: string; recommendations: PolicyRecommendation[] }>(
      `/policy-recommendations/${encodeURIComponent(country)}`
    ),

  getFiscalSpaceAnalysis: () =>
    api.get<FiscalSpace[]>('/fiscal-space-analysis'),

  getDebtSustainabilityDashboard: () =>
    api.get<DebtSustainability[]>('/debt-sustainability-dashboard'),

  exportData: (params: { countries?: string[]; years?: string[]; metrics?: string[] }) =>
    api.get('/export-data', { params, responseType: 'blob' }),
};

export default apiService;
