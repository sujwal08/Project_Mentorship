import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';
import { marketService } from '../market/marketService';

export const getPortfolio = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const portfolio = await prisma.portfolio.findUnique({
            where: { userId },
            include: {
                holdings: true,
                trades: {
                    orderBy: { timestamp: 'desc' },
                    take: 50 // last 50 trades
                }
            }
        });

        if (!portfolio) throw new AppError(404, 'Portfolio not found');
        res.json(portfolio);
    } catch (err) {
        next(err);
    }
};

export const executeTrade = (type: 'BUY' | 'SELL') => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { symbol, quantity } = req.body;

        const stock = marketService.getCachedStock(symbol);
        if (!stock) throw new AppError(404, `Stock ${symbol} not currently available`);

        const currentPrice = stock.price;
        const totalValue = currentPrice * quantity;

        await prisma.$transaction(async (tx: any) => {
            const portfolio = await tx.portfolio.findUnique({
                where: { userId },
                include: { holdings: { where: { symbol } } }
            });

            if (!portfolio) throw new AppError(404, 'Portfolio not found');

            if (type === 'BUY') {
                if (Number(portfolio.balance) < totalValue) {
                    throw new AppError(400, 'Insufficient balance');
                }

                // Deduct balance
                await tx.portfolio.update({
                    where: { id: portfolio.id },
                    data: { balance: Number(portfolio.balance) - totalValue }
                });

                const holding = portfolio.holdings[0];
                if (holding) {
                    // Update existing holding avg price
                    const newQty = holding.quantity + quantity;
                    const newAvgPrice = ((Number(holding.averagePrice) * holding.quantity) + totalValue) / newQty;

                    await tx.holding.update({
                        where: { id: holding.id },
                        data: { quantity: newQty, averagePrice: newAvgPrice }
                    });
                } else {
                    // Create new holding
                    await tx.holding.create({
                        data: {
                            portfolioId: portfolio.id,
                            symbol,
                            quantity,
                            averagePrice: currentPrice
                        }
                    });
                }
            } else {
                // SELL Logic
                const holding = portfolio.holdings[0];
                if (!holding || holding.quantity < quantity) {
                    throw new AppError(400, 'Insufficient holding quantity');
                }

                // Add to balance
                await tx.portfolio.update({
                    where: { id: portfolio.id },
                    data: { balance: Number(portfolio.balance) + totalValue }
                });

                if (holding.quantity === quantity) {
                    // Sell all
                    await tx.holding.delete({ where: { id: holding.id } });
                } else {
                    // Sell partial
                    await tx.holding.update({
                        where: { id: holding.id },
                        data: { quantity: holding.quantity - quantity }
                    });
                }
            }

            // Record trade
            await tx.trade.create({
                data: {
                    portfolioId: portfolio.id,
                    symbol,
                    type,
                    quantity,
                    price: currentPrice
                }
            });
        });

        const updatedPortfolio = await prisma.portfolio.findUnique({
            where: { userId },
            include: { holdings: true }
        });

        res.status(type === 'BUY' ? 201 : 200).json({
            message: `Successfully ${type} ${quantity} ${symbol}`,
            portfolio: updatedPortfolio
        });
    } catch (err) {
        next(err);
    }
};

export const getTradeHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const portfolio = await prisma.portfolio.findUnique({
            where: { userId },
            include: {
                trades: {
                    orderBy: { timestamp: 'desc' },
                    take: 100
                }
            }
        });

        if (!portfolio) throw new AppError(404, 'Portfolio not found');
        res.json(portfolio.trades);
    } catch (err) {
        next(err);
    }
};
