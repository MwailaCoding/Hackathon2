import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  GitCompare,
  AlertTriangle,
  FileText,
  TrendingUp,
  Shield,
  Menu,
  X,
  Bell,
  User,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'text-blue-500' },
    { name: 'Country Analysis', href: '/country', icon: Globe, color: 'text-green-500' },
    { name: 'Compare Countries', href: '/compare', icon: GitCompare, color: 'text-purple-500' },
    { name: 'Cluster Analysis', href: '/clusters', icon: TrendingUp, color: 'text-orange-500' },
    { name: 'Early Warning', href: '/warnings', icon: AlertTriangle, color: 'text-red-500' },
    { name: 'Policy Recommendations', href: '/recommendations', icon: FileText, color: 'text-indigo-500' },
    { name: 'Fiscal Space', href: '/fiscal-space', icon: TrendingUp, color: 'text-teal-500' },
    { name: 'Debt Sustainability', href: '/debt-sustainability', icon: Shield, color: 'text-pink-500' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Globe className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  African Fiscal Analyzer
                </h1>
                <p className="text-xs text-gray-500">Economic Intelligence Platform</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-16 left-0 bottom-0 w-72 bg-white/80 backdrop-blur-lg border-r border-gray-200 transform transition-transform duration-300 z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon size={20} className={active ? 'text-white' : item.color} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="lg:ml-72 pt-16">
        <main className="p-6 max-w-[1600px] mx-auto">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
