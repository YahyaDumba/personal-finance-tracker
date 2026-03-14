import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, ArrowUpDown, X, Check } from 'lucide-react';
import { getTransactions, createTransaction, deleteTransaction, updateTransaction, createCategory, getCategories } from '../services/api';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/common/Sidebar';

export default function Transactions() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({ type: '', startDate: '', endDate: '' });
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    type: 'expense', amount: '', description: '',
    categoryId: '', frequency: 'one-time',
    transactionDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactions(filter);
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, [filter]);

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
    if (!formData.amount || !formData.transactionDate) {
      setError('Amount and date are required');
      return;
    }
    try {
      if (editingId) {
        await updateTransaction(editingId, formData);
      } else {
        await createTransaction(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        type: 'expense', amount: '', description: '',
        categoryId: '', frequency: 'one-time',
        transactionDate: new Date().toISOString().split('T')[0]
      });
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (tx) => {
    setFormData({
      type: tx.type, amount: tx.amount,
      description: tx.description || '',
      categoryId: tx.categoryId || '',
      frequency: tx.frequency || 'one-time',
      transactionDate: tx.transactionDate?.split('T')[0]
    });
    setEditingId(tx.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page-wrapper">
      <Sidebar />

      <main className="page-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Transactions</h1>
            <p className="page-subtitle">Manage your income and expenses</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="btn-primary">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-4 md:mb-6">
          <div className="flex flex-wrap gap-3">
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="flex-1 min-w-[120px] bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-blue-500">
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input type="date" value={filter.startDate}
              onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              className="flex-1 min-w-[130px] bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-blue-500"
            />
            <input type="date" value={filter.endDate}
              onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              className="flex-1 min-w-[130px] bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => setFilter({ type: '', startDate: '', endDate: '' })}
              className="text-gray-500 hover:text-gray-900 text-sm px-4 py-2 rounded-xl border border-gray-300 hover:border-gray-400 transition-colors whitespace-nowrap">
              Clear
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white border border-blue-200 rounded-2xl p-4 md:p-6 mb-4 md:mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Type</label>
                <select value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Amount</label>
                <input type="number" value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Date</label>
                <input type="date" value={formData.transactionDate}
                  onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Description</label>
                <input type="text" value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Frequency</label>
                <select value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="input-field">
                  <option value="one-time">One-time</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Category</label>
                <select value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="input-field">
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name} ({cat.type})</option>
                  ))}
                </select>
              </div>

              {/* Quick Add Category */}
              <div className="col-span-1 sm:col-span-2 md:col-span-3 pt-3 border-t border-gray-200 mt-1">
                <p className="text-sm text-gray-500 mb-2">➕ Quick add new category:</p>
                <div className="flex flex-wrap gap-2">
                  <input type="text" placeholder="e.g. Food, Salary"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 min-w-[120px] bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <select value={newCatType}
                    onChange={(e) => setNewCatType(e.target.value)}
                    className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-blue-500">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <button
                    onClick={async () => {
                      if (!newCatName) return;
                      try {
                        await createCategory({ name: newCatName, type: newCatType });
                        const res = await getCategories();
                        setCategories(res.data.data || []);
                        setNewCatName('');
                      } catch (err) { console.error(err); }
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap">
                    Add Category
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors text-sm">
                <Check className="w-4 h-4" />
                {editingId ? 'Update' : 'Add Transaction'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="card">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="spinner" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <ArrowUpDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="list-item">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                      {tx.type === 'income' ? <TrendingUp className="w-4 h-4 md:w-5 md:h-5" /> : <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{tx.description || tx.categoryName || 'Transaction'}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(tx.transactionDate).toLocaleDateString()}
                        <span className="hidden sm:inline"> • {tx.frequency}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-2">
                    <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                    </span>
                    <button onClick={() => handleEdit(tx)}
                      className="text-gray-400 hover:text-blue-500 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(tx.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}