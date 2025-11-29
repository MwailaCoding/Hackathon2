# African Fiscal Analyzer

A comprehensive, colorful web application for analyzing African fiscal and economic data. This platform provides deep insights into government finances, debt sustainability, economic trends, and policy recommendations across African nations.

## Features

### 1. Overview Dashboard
- Comprehensive metrics overview across all African countries
- Regional and income group distributions
- Key economic indicators visualization
- Interactive charts showing GDP growth, debt levels, inflation, and HDI

### 2. Country Analysis
- Deep dive into individual country fiscal metrics
- Historical trend analysis with interactive line charts
- Risk assessment (debt, inflation, fiscal)
- Advanced metrics (fiscal space, debt sustainability, economic resilience)
- 3-year future predictions for key indicators
- Radar charts for performance visualization

### 3. Country Comparison
- Side-by-side comparison of up to 5 countries
- Interactive radar and bar charts
- Comprehensive metrics table
- Regional and income group context

### 4. Cluster Analysis
- Machine learning-based country grouping
- Scatter plot visualizations
- 4 distinct clusters based on economic characteristics
- Interactive cluster exploration

### 5. Early Warning System
- Real-time risk monitoring
- High, medium, and low risk categorization
- Debt, inflation, and fiscal risk alerts
- Country-specific warnings with actionable insights

### 6. Policy Recommendations
- AI-powered policy insights
- Priority-based recommendations
- Actionable steps for each recommendation
- Categories: Debt Management, Economic Growth, Monetary Policy, Human Development

### 7. Fiscal Space Analysis
- Government financial flexibility measurement
- Sortable and filterable data tables
- Revenue, expenditure, and debt analysis
- Top performers visualization

### 8. Debt Sustainability Dashboard
- Comprehensive debt sustainability assessment
- 4 sustainability categories (Sustainable, Moderately Sustainable, At Risk, Unsustainable)
- Multi-dimensional scatter plots
- Debt service ratio analysis

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Backend Integration

The application connects to a Flask backend hosted at:
```
https://hackathon-1-boow.onrender.com
```

### Available API Endpoints:
- `/api/overview` - Overview statistics
- `/api/country/<name>` - Country-specific analysis
- `/api/compare` - Compare multiple countries
- `/api/cluster-analysis` - ML-based clustering
- `/api/early-warning` - Risk assessment
- `/api/policy-recommendations/<name>` - Policy insights
- `/api/fiscal-space-analysis` - Fiscal capacity analysis
- `/api/debt-sustainability-dashboard` - Debt sustainability metrics

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Design Features

- **Color Scheme**: Multi-colored gradient system with unique colors for each section
  - Dashboard: Blue gradient
  - Country Analysis: Green-Teal gradient
  - Compare: Purple-Pink gradient
  - Clusters: Orange-Red gradient
  - Early Warning: Red-Orange gradient
  - Policy Recommendations: Indigo-Purple gradient
  - Fiscal Space: Teal-Cyan gradient
  - Debt Sustainability: Pink-Rose gradient

- **Typography**: Inter font family from Google Fonts
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Animations**: Smooth transitions, hover effects, and loading states
- **Modern UI**: Rounded corners, subtle shadows, gradient backgrounds

## Key Components

### Layout
- Persistent header with branding
- Collapsible sidebar navigation
- Responsive design for all screen sizes

### MetricCard
- Reusable card component for displaying key metrics
- Supports icons, trends, and color customization

### LoadingSpinner
- Animated loading indicator
- Dual-ring design for visual appeal

### Charts
- Line charts for historical trends
- Bar charts for comparisons
- Pie charts for distributions
- Radar charts for multi-dimensional analysis
- Scatter plots for clustering and correlations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
