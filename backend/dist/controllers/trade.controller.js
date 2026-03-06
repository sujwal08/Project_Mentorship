"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeHistory = exports.executeTrade = exports.getPortfolio = void 0;
const prisma_1 = require("../lib/prisma");
const error_middleware_1 = require("../middlewares/error.middleware");
const marketService_1 = require("../market/marketService");
const getPortfolio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const portfolio = yield prisma_1.prisma.portfolio.findUnique({
            where: { userId },
            include: {
                holdings: true,
                trades: {
                    orderBy: { timestamp: 'desc' },
                    take: 50 // last 50 trades
                }
            }
        });
        if (!portfolio)
            throw new error_middleware_1.AppError(404, 'Portfolio not found');
        res.json(portfolio);
    }
    catch (err) {
        next(err);
    }
});
exports.getPortfolio = getPortfolio;
const executeTrade = (type) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { symbol, quantity } = req.body;
        const stock = marketService_1.marketService.getCachedStock(symbol);
        if (!stock)
            throw new error_middleware_1.AppError(404, `Stock ${symbol} not currently available`);
        const currentPrice = stock.price;
        const totalValue = currentPrice * quantity;
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const portfolio = yield tx.portfolio.findUnique({
                where: { userId },
                include: { holdings: { where: { symbol } } }
            });
            if (!portfolio)
                throw new error_middleware_1.AppError(404, 'Portfolio not found');
            if (type === 'BUY') {
                if (Number(portfolio.balance) < totalValue) {
                    throw new error_middleware_1.AppError(400, 'Insufficient balance');
                }
                // Deduct balance
                yield tx.portfolio.update({
                    where: { id: portfolio.id },
                    data: { balance: Number(portfolio.balance) - totalValue }
                });
                const holding = portfolio.holdings[0];
                if (holding) {
                    // Update existing holding avg price
                    const newQty = holding.quantity + quantity;
                    const newAvgPrice = ((Number(holding.averagePrice) * holding.quantity) + totalValue) / newQty;
                    yield tx.holding.update({
                        where: { id: holding.id },
                        data: { quantity: newQty, averagePrice: newAvgPrice }
                    });
                }
                else {
                    // Create new holding
                    yield tx.holding.create({
                        data: {
                            portfolioId: portfolio.id,
                            symbol,
                            quantity,
                            averagePrice: currentPrice
                        }
                    });
                }
            }
            else {
                // SELL Logic
                const holding = portfolio.holdings[0];
                if (!holding || holding.quantity < quantity) {
                    throw new error_middleware_1.AppError(400, 'Insufficient holding quantity');
                }
                // Add to balance
                yield tx.portfolio.update({
                    where: { id: portfolio.id },
                    data: { balance: Number(portfolio.balance) + totalValue }
                });
                if (holding.quantity === quantity) {
                    // Sell all
                    yield tx.holding.delete({ where: { id: holding.id } });
                }
                else {
                    // Sell partial
                    yield tx.holding.update({
                        where: { id: holding.id },
                        data: { quantity: holding.quantity - quantity }
                    });
                }
            }
            // Record trade
            yield tx.trade.create({
                data: {
                    portfolioId: portfolio.id,
                    symbol,
                    type,
                    quantity,
                    price: currentPrice
                }
            });
        }));
        const updatedPortfolio = yield prisma_1.prisma.portfolio.findUnique({
            where: { userId },
            include: { holdings: true }
        });
        res.status(type === 'BUY' ? 201 : 200).json({
            message: `Successfully ${type} ${quantity} ${symbol}`,
            portfolio: updatedPortfolio
        });
    }
    catch (err) {
        next(err);
    }
});
exports.executeTrade = executeTrade;
const getTradeHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const portfolio = yield prisma_1.prisma.portfolio.findUnique({
            where: { userId },
            include: {
                trades: {
                    orderBy: { timestamp: 'desc' },
                    take: 100
                }
            }
        });
        if (!portfolio)
            throw new error_middleware_1.AppError(404, 'Portfolio not found');
        res.json(portfolio.trades);
    }
    catch (err) {
        next(err);
    }
});
exports.getTradeHistory = getTradeHistory;
