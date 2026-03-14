const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {connectDB} = require('./config/db')
const transactionRoutes = require('./routes/transactionRoutes')
const budgetRoutes = require('./routes/budgetRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes')
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth',authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets',budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);


//Success message
app.get('/', (req, res)=>{
    res.json({
        success: true,
        message: 'Your Backend is running'
    });
});

//Error message
app.use((req,res)=>{
    res.status(404).json({
        success: false,
        message: 'Route not Found'
    });
});

const port = process.env.PORT;

app.listen(port, ()=>{
    console.log('Server running successfully on',port);
})

module.exports = app;