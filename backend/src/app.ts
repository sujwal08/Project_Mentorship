import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import marketRoutes from './routes/market.routes';
import tradeRoutes from './routes/trade.routes';
import watchlistRoutes from './routes/watchlist.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.use(errorHandler);

export default app;
