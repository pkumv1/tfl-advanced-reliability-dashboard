import React, { useState, useEffect, useMemo, useCallback, memo, Suspense } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area, ComposedChart, ReferenceLine, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap } from 'recharts';
import { AlertTriangle, Activity, MapPin, TrendingUp, Clock, Zap, Thermometer, Download, Target, Layers, BarChart3, Brain, Shield, Radio, Wifi, Server, Globe, Network, Timer, RefreshCw, GitBranch, Share2, Calendar, Gauge, Cpu, Database, TrendingDown, Award, Crosshair, Bell, Users, Settings, AlertCircle, CheckCircle, XCircle, Wrench, Map, Battery, Signal, Monitor, Maximize2, Info, FileText, Lightbulb, Clipboard } from 'lucide-react';

// Constants
const FAULT_TYPE_COLORS = {
  'Infant Mortality': '#dc2626',
  'Wear-out': '#ea580c',
  'Early-life': '#eab308',
  'Protective': '#22c55e',
  'Normal Operation': '#3b82f6'
};

const SIGNIFICANCE_COLORS = {
  'Critical': '#dc2626',
  'High': '#ea580c',
  'Medium': '#eab308',
  'Protective': '#22c55e'
};

const CATEGORY_COLORS = {
  'Operational': '#dc2626',
  'Performance': '#ea580c',
  'Hardware': '#3b82f6',
  'Service': '#22c55e',
  'Configuration': '#8b5cf6',
  'Payment': '#f97316',
  'Environmental': '#06b6d4'
};

const CLUSTER_COLORS = {
  'High-Volume': '#dc2626',
  'Critical': '#ea580c',
  'Stable': '#22c55e',
  'Efficient': '#3b82f6',
  'Moderate': '#8b5cf6'
};

const MODEL_COLORS = {
  'Logistic Regression': '#ef4444',
  'Random Forest': '#22c55e',
  'XGBoost': '#3b82f6',
  'CatBoost': '#8b5cf6',
  'KNN': '#f97316',
  'ANN': '#06b6d4'
};

// Enhanced tab configuration
const ENHANCED_TABS = [
  { id: 'overview', label: 'System Overview', icon: BarChart3 },
  { id: 'realtime', label: 'Real-time Monitor', icon: Radio },
  { id: 'ml-analytics', label: 'ML Analytics', icon: Brain },
  { id: 'survival', label: 'Survival Analysis', icon: Activity },
  { id: 'hazard', label: 'Hazard Models', icon: Target },
  { id: 'rul', label: 'RUL Prediction', icon: Timer },
  { id: 'fault-patterns', label: 'Fault Patterns', icon: Thermometer },
  { id: 'clustering', label: 'Device Clustering', icon: Globe },
  { id: 'association', label: 'Association Rules', icon: Network },
  { id: 'reliability', label: 'Reliability Metrics', icon: Shield },
  { id: 'recommendations', label: 'Recommendations', icon: TrendingUp }
];

// Mock data
const MOCK_DATA = {
  stations: [
    { id: 'TOC1444', name: 'EUSTON', devices: 28, critical: 3, high: 5, medium: 12, low: 8, riskScore: 0.65, mtbf: 512.3, cluster: 'High-Volume', passengerFlow: 45000, energyUsage: 89.2, networkHealth: 78, availability: 94.2, mttr: 45 },
    { id: 'NLR1409', name: 'GOSPEL OAK', devices: 26, critical: 2, high: 4, medium: 10, low: 10, riskScore: 0.42, mtbf: 687.5, cluster: 'Stable', passengerFlow: 12000, energyUsage: 67.8, networkHealth: 92, availability: 98.1, mttr: 32 },
    { id: '0728', name: 'TOTTENHAM COURT ROAD', devices: 32, critical: 4, high: 6, medium: 15, low: 7, riskScore: 0.78, mtbf: 398.2, cluster: 'Critical', passengerFlow: 52000, energyUsage: 95.4, networkHealth: 65, availability: 91.5, mttr: 67 },
    { id: '0534', name: 'CALEDONIAN ROAD', devices: 24, critical: 1, high: 3, medium: 9, low: 11, riskScore: 0.28, mtbf: 892.7, cluster: 'Efficient', passengerFlow: 8500, energyUsage: 45.2, networkHealth: 95, availability: 99.2, mttr: 18 },
    { id: 'TOC5112', name: 'BLACKFRIARS', devices: 29, critical: 3, high: 5, medium: 13, low: 8, riskScore: 0.55, mtbf: 578.9, cluster: 'Moderate', passengerFlow: 28000, energyUsage: 72.1, networkHealth: 85, availability: 96.8, mttr: 38 }
  ],

  realTimeMetrics: [
    { timestamp: '10:00', activeDevices: 137, faults: 12, networkUtilization: 78, powerConsumption: 342, criticalRulDevices: 2, avgRulHours: 204.5 },
    { timestamp: '10:15', activeDevices: 137, faults: 15, networkUtilization: 82, powerConsumption: 356, criticalRulDevices: 3, avgRulHours: 198.2 },
    { timestamp: '10:30', activeDevices: 136, faults: 18, networkUtilization: 85, powerConsumption: 378, criticalRulDevices: 4, avgRulHours: 187.8 },
    { timestamp: '10:45', activeDevices: 135, faults: 21, networkUtilization: 88, powerConsumption: 395, criticalRulDevices: 5, avgRulHours: 175.3 },
    { timestamp: '11:00', activeDevices: 134, faults: 19, networkUtilization: 84, powerConsumption: 387, criticalRulDevices: 4, avgRulHours: 182.6 }
  ],

  mlModelResults: [
    { model: 'Logistic Regression', accuracy: 0.937, rocAuc: 0.9849, precision: 0.94, recall: 0.94, f1Score: 0.94 },
    { model: 'Random Forest', accuracy: 0.977, rocAuc: 0.9948, precision: 0.98, recall: 0.98, f1Score: 0.98 },
    { model: 'XGBoost', accuracy: 0.987, rocAuc: 0.9976, precision: 0.99, recall: 0.99, f1Score: 0.99 },
    { model: 'CatBoost', accuracy: 0.987, rocAuc: 0.9975, precision: 0.99, recall: 0.99, f1Score: 0.99 },
    { model: 'KNN', accuracy: 0.952, rocAuc: 0.9789, precision: 0.95, recall: 0.95, f1Score: 0.95 },
    { model: 'ANN', accuracy: 0.973, rocAuc: 0.9891, precision: 0.97, recall: 0.97, f1Score: 0.97 }
  ]
};

// Utility functions
const formatNumber = (num) => num?.toLocaleString() || '0';
const formatPercent = (num) => `${((num || 0) * 100).toFixed(1)}%`;
const getSignificanceColor = (significance) => SIGNIFICANCE_COLORS[significance] || '#6b7280';
const getCategoryColor = (category) => CATEGORY_COLORS[category] || '#6b7280';
const getClusterColor = (cluster) => CLUSTER_COLORS[cluster] || '#6b7280';

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-red-200 max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-600">Dashboard Error</h2>
            </div>
            <p className="text-slate-600 mb-4">An error occurred while loading the dashboard. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Spinner
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center h-64" role="status" aria-label="Loading">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="sr-only">Loading...</span>
  </div>
));

// Overview Tab
const OverviewTab = memo(() => {
  const systemMetrics = useMemo(() => {
    const totalDevices = 302;
    const totalStations = 11;
    const totalCritical = MOCK_DATA.stations.reduce((sum, station) => sum + station.critical, 0);
    const avgAvailability = MOCK_DATA.stations.reduce((sum, station) => sum + station.availability, 0) / MOCK_DATA.stations.length;
    const avgMTBF = MOCK_DATA.stations.reduce((sum, station) => sum + station.mtbf, 0) / MOCK_DATA.stations.length;
    
    return { totalDevices, totalStations, totalCritical, avgAvailability, avgMTBF };
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="space-y-8">
        <section className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Devices</p>
                <p className="text-2xl font-bold text-blue-900">{systemMetrics.totalDevices}</p>
                <p className="text-xs text-blue-700">Across {systemMetrics.totalStations} stations</p>
              </div>
              <Server className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Active Stations</p>
                <p className="text-2xl font-bold text-green-900">{systemMetrics.totalStations}</p>
                <p className="text-xs text-green-700">Full network coverage</p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Critical Issues</p>
                <p className="text-2xl font-bold text-red-900">{systemMetrics.totalCritical}</p>
                <p className="text-xs text-red-700">Immediate attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">System Availability</p>
                <p className="text-2xl font-bold text-purple-900">{systemMetrics.avgAvailability.toFixed(1)}%</p>
                <p className="text-xs text-purple-700">Above 95% target</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Average MTBF</p>
                <p className="text-2xl font-bold text-orange-900">{systemMetrics.avgMTBF.toFixed(0)}h</p>
                <p className="text-xs text-orange-700">Improving trend</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">ML Accuracy</p>
                <p className="text-2xl font-bold text-green-900">98.7%</p>
                <p className="text-xs text-green-700">XGBoost performance</p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </section>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <MapPin className="h-6 w-6 mr-3 text-blue-600" />
            Station Health Overview ({systemMetrics.totalDevices} devices across {systemMetrics.totalStations} stations)
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {MOCK_DATA.stations.map(station => (
              <div key={station.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{station.name}</h4>
                    <p className="text-sm text-slate-600">{station.id}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Risk Score:</span>
                    <span className="font-medium text-blue-600">
                      {(station.riskScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Devices:</span>
                    <span className="font-medium text-slate-900">{station.devices}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Critical Issues:</span>
                    <span className="font-medium text-red-600">{station.critical}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">MTBF:</span>
                    <span className="font-medium text-slate-900">{station.mtbf.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Network Health:</span>
                    <span className="font-medium text-blue-600">{station.networkHealth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
});

// Real-time Tab
const RealTimeTab = memo(() => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-blue-600" />
            Real-time Device Health Trends
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={MOCK_DATA.realTimeMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="timestamp" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="activeDevices" stroke="#3b82f6" strokeWidth={3} name="Active Devices" />
              <Line type="monotone" dataKey="faults" stroke="#dc2626" strokeWidth={3} name="Faults" />
              <Line type="monotone" dataKey="criticalRulDevices" stroke="#f59e0b" strokeWidth={3} name="Critical Devices" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Suspense>
  );
});

// ML Analytics Tab
const MLAnalyticsTab = memo(() => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Brain className="h-6 w-6 mr-3 text-blue-600" />
            Model Performance Comparison
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={MOCK_DATA.mlModelResults}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="model" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0.9, 1]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy" />
              <Bar dataKey="precision" fill="#22c55e" name="Precision" />
              <Bar dataKey="recall" fill="#f59e0b" name="Recall" />
              <Bar dataKey="f1Score" fill="#8b5cf6" name="F1-Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Suspense>
  );
});

// Main Dashboard Component
function TfLDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = useCallback((tabId) => {
    if (tabId === activeTab) return;
    
    setIsLoading(true);
    setActiveTab(tabId);
    
    setTimeout(() => setIsLoading(false), 300);
  }, [activeTab]);

  useEffect(() => {
    if (!realTimeMode) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [realTimeMode]);

  const renderTabContent = useCallback(() => {
    if (isLoading) return <LoadingSpinner />;

    switch(activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'realtime':
        return <RealTimeTab />;
      case 'ml-analytics':
        return <MLAnalyticsTab />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-slate-500">
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">More Tabs Coming Soon</h3>
              <p className="text-slate-500">Additional analytics features will be available in this tab.</p>
            </div>
          </div>
        );
    }
  }, [activeTab, isLoading]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[1920px] mx-auto p-4 lg:p-6 xl:p-8">
          <header className="bg-slate-900 text-white p-6 xl:p-8 rounded-lg mb-8 shadow-lg">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold mb-3 text-white">
                  TfL Advanced Reliability Analytics Dashboard
                </h1>
                <p className="text-slate-300 text-lg xl:text-xl mb-4">AI-Powered Predictive Maintenance & Reliability Engineering</p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm bg-blue-600 px-4 py-2 rounded-md font-medium flex items-center">
                    <Server className="h-4 w-4 mr-2" />
                    302 Devices
                  </span>
                  <span className="text-sm bg-blue-700 px-4 py-2 rounded-md font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    11 Stations
                  </span>
                  <span className="text-sm bg-blue-800 px-4 py-2 rounded-md font-medium flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    XGBoost 98.7% Accuracy
                  </span>
                  <span className="text-sm bg-green-600 px-4 py-2 rounded-md font-medium flex items-center">
                    <Timer className="h-4 w-4 mr-2" />
                    RUL Predictions Active
                  </span>
                </div>
              </div>
              <div className="text-left xl:text-right">
                <div className="flex items-center space-x-3 mb-3">
                  <button
                    onClick={() => setRealTimeMode(!realTimeMode)}
                    className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                      realTimeMode ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${realTimeMode ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></div>
                    <span>{realTimeMode ? 'Live' : 'Static'}</span>
                  </button>
                  <button className="p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-slate-300 mb-1">Last Updated: {lastUpdate.toLocaleTimeString()}</p>
                <p className="text-xs text-slate-400">ML Accuracy: 98.7% | Training: 118K records</p>
              </div>
            </div>
          </header>

          <nav className="flex flex-wrap gap-2 mb-8 bg-white p-3 rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
            {ENHANCED_TABS.slice(0,3).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 xl:px-6 py-3 rounded-md font-medium flex items-center space-x-2 transition-all text-sm whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <main role="main">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default TfLDashboard;