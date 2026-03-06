import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';

export const getWatchlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const watchlist = await prisma.watchlist.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(watchlist);
    } catch (err) {
        next(err);
    }
};

export const addToWatchlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const symbol = (req.params.symbol as string).toUpperCase();

        const existing = await prisma.watchlist.findUnique({
            where: { userId_symbol: { userId, symbol } }
        });

        if (existing) {
            throw new AppError(400, 'Symbol already in watchlist');
        }

        const item = await prisma.watchlist.create({
            data: { userId, symbol }
        });

        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const symbol = (req.params.symbol as string).toUpperCase();

        await prisma.watchlist.delete({
            where: { userId_symbol: { userId, symbol } }
        });

        res.json({ message: 'Removed from watchlist' });
    } catch (err) {
        if ((err as any).code === 'P2025') {
            next(new AppError(404, 'Symbol not in watchlist'));
        } else {
            next(err);
        }
    }
};
