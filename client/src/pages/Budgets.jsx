import { useState, useEffect } from 'react';
import { Plus, Trash2, PieChart, X, Check } from 'lucide-react';
import { getBudgets, createBudget, deleteBudget, getCategories } from '../services/api';
import Sidebar from '../components/common/Sidebar';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    categoryId: '', monthlyLimit: '',
    month: currentMonth, year: currentYear
  });

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await getBudgets({ month: currentMonth, year: currentYear });
      setBudgets(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudgets(); }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data || []);
      } catch (err) { console.error(err); }
    };
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!formData.categoryId || !formData.monthlyLimit) {
      setError('All fields are required');
      return;
    }
    try {
      await createBudget(formData);
      setShowForm(false);
      setFormData({ categoryId: '', monthlyLimit: '', month: currentMonth, year: currentYear });
      setError('');
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await deleteBudget(id);
      fetchBudgets();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
            <p className="text-gray-500 mt-1">Set and track your monthly budgets</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />Set Budget
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white border border-blue-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">New Budget</h3>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm">{error}</div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500">
                  <option value="">Select Category</option>
                  {categories.map((cat) => {
                    const isIncome = cat.type === 'income';
                    return (
                      <option key={cat.id} value={cat.id} disabled={isIncome}
                        style={{ color: isIncome ? '#9ca3af' : '#111827' }}>
                        {cat.name} {isIncome ? '(income)' : '(expense)'}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Monthly Limit (₹)</label>
                <input type="number" value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                  placeholder="5000"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Month</label>
                <select value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Year</label>
                <input type="number" value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2026"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors">
                <Check className="w-4 h-4" />Save Budget
              </button>
              <button onClick={() => setShowForm(false)}
                className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Budgets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : budgets.length === 0 ? (
            <div className="col-span-2 bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
              <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No budgets set for this month</p>
            </div>
          ) : (
            budgets.map((budget) => {
              const percentage = Math.min(budget.percentageUsed || 0, 100);
              const isOverBudget = budget.percentageUsed > 100;
              return (
                <div key={budget.id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{budget.categoryName}</h3>
                      <p className="text-gray-500 text-sm">
                        ₹{Number(budget.spent).toLocaleString()} of ₹{Number(budget.monthlyLimit).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isOverBudget && (
                      <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : percentage > 80 ? 'text-yellow-500' : 'text-green-600'}`}>
                        {budget.percentageUsed || 0}%
                      </span>
            )}
                      <button onClick={() => handleDelete(budget.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-400' : 'bg-green-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {isOverBudget && (
                    <p className="text-red-500 text-xs mt-2 font-medium">Over budget!</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}