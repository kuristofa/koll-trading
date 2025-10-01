import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import itemRoutes from './routes/items.js';
import transactionRoutes from './routes/transactions.js';

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Database Connection ----------
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// ---------- Simple Test Routes ----------
app.get('/', (req, res) => {
    res.send('API is running...')
});

app.get('/api', (req, res) => {
    res.json({ message: 'Junkshop API is running' });
});

// ---------- Items API Routes ----------
app.use('/api/items', itemRoutes);

// ---------- Transactions API Routes ----------
app.use('/api/transactions', transactionRoutes);


// ---------- Export for Vercel ----------
export default app;