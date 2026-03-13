const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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