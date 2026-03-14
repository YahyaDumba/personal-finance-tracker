import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, Plus, ArrowUpDown} from 'lucide-react';
import { getDashboard } from '../services/api';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/common/Sidebar';

const StatCard = ({ title, amount, icon: Icon, color, textColor }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-500 text-sm font-medium">{title}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className={`w-5 h-5 ${textColor}`} />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900">
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
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* Sidebar */}
<Sidebar />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.fullName}!</p>
          </div>
          <Link to="/transactions"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="spinner"/>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Income"
                amount={dashboardData?.summary?.totalIncome}
                icon={TrendingUp}
                color="bg-green-100"
                textColor="text-green-600"
              />
              <StatCard
                title="Total Expenses"
                amount={dashboardData?.summary?.totalExpense}
                icon={TrendingDown}
                color="bg-red-100"
                textColor="text-red-600"
              />
              <StatCard
                title="Net Balance"
                amount={dashboardData?.summary?.netBalance}
                icon={Wallet}
                color="bg-blue-100"
                textColor="text-blue-600"
              />
            </div>

            {/* Recent Transactions */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <Link to="/transactions" className="text-blue-600 text-sm hover:text-blue-500">
                  View all →
                </Link>
              </div>

              {dashboardData?.recentTransactions?.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowUpDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">No transactions yet</p>
                  <Link to="/transactions"
                    className="text-blue-600 text-sm hover:text-blue-500 mt-2 inline-block">
                    Add your first transaction →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.recentTransactions?.map((tx) => (
                    <div key={tx.id}
                      className="list-item">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{tx.description || tx.categoryName || 'Transaction'}</p>
                          <p className="text-gray-400 text-xs">{new Date(tx.transactionDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
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