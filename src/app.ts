import express from 'express';
import mongoose from 'mongoose';
import gameRoutes from './routes/gameRoutes';

const app = express();
app.use(express.json());


const MONGODB_URI = 'mongodb://localhost:27017/memory-game?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/game', gameRoutes);

export default app;
