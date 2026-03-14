import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {'Content-Type':'application/json'}
});

//Automatically attach token to every request
api.interceptors.request.use((config)=> {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const verifyEmail = (token) => api.get(`/auth/verify-email?token=${token}`);

//Transactions
export const getTransactions = (params) => api.get('/transactions', {params});
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

//Budgets
export const getBudgets = (params) => api.get('/budgets', {params});
export const createBudget = (data) => api.post('/budgets', data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

//Categories
export const getCategories = (params) => api.get('/categories', {params});
export const createCategory = (data) => api.post('/categories', data);

//Dashboard
export const getDashboard = (params) => api.get('/dashboard', {params});

export default api;