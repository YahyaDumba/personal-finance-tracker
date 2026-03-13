import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, LogOut, Plus, LayoutDashboard, ArrowUpDown, PieChart } from 'lucide-react';
import { getDashboard } from '../services/api';
import useAuthStore from '../store/authStore';

const StatCard = ({ title, amount, icon: Icon, color }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-400 text-sm">{title}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="text-2xl font-bold text-white">
      ₹{Number(amount || 0).toLocaleString()}
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard({ month: currentMonth, year: currentYear });
        setDashboardData(res.data.data);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            {/* <span className="text-2xl">💎</span> */}
            <span className="text-4xl font-bold">FinTrack</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/transactions"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <ArrowUpDown className="w-5 h-5" />
            Transactions
          </Link>
          <Link to="/budgets"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <PieChart className="w-5 h-5" />
            Budgets
          </Link>
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-950 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.fullName}! 👋</p>
          </div>
          <Link to="/transactions"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Income"
                amount={dashboardData?.summary?.totalIncome}
                icon={TrendingUp}
                color="bg-green-950 text-green-400"
              />
              <StatCard
                title="Total Expenses"
                amount={dashboardData?.summary?.totalExpense}
                icon={TrendingDown}
                color="bg-red-950 text-red-400"
              />
              <StatCard
                title="Net Balance"
                amount={dashboardData?.summary?.netBalance}
                icon={Wallet}
                color="bg-blue-950 text-blue-400"
              />
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <Link to="/transactions" className="text-blue-400 text-sm hover:text-blue-300">
                  View all →
                </Link>
              </div>

              {dashboardData?.recentTransactions?.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowUpDown className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500">No transactions yet</p>
                  <Link to="/transactions"
                    className="text-blue-400 text-sm hover:text-blue-300 mt-2 inline-block">
                    Add your first transaction →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.recentTransactions?.map((tx) => (
                    <div key={tx.id}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'}`}>
                          {tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tx.description || tx.categoryName || 'Transaction'}</p>
                          <p className="text-gray-500 text-xs">{new Date(tx.transactionDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}