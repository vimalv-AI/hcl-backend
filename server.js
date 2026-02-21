const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();


app.use(express.json());

// Dev logging middleware
app.use(morgan('dev'));

// Enable CORS with options
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://hcl-portal.vimalv.com',
        'http://hcl-portal.vimalv.com',
        'http://13.204.79.112:5000',
        'http://13.204.79.112'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'employee-id']
}));


const employeeRoutes = require('./routes/employeeRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const errorHandler = require('./middleware/error');

app.use('/v1/hcl/employees', employeeRoutes);
app.use('/v1/hcl/feedbacks', feedbackRoutes);

app.get('/', (req, res) => {
    res.send('Employee API is running');
});

// Important: Note that error handling middleware must be placed after all other app.use() and routes calls
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
