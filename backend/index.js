import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.js';

dotenv.config();

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Database Connection ----------
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


// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT,  () => {
    console.log('Server is running on port 5000')
});