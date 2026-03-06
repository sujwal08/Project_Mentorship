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
exports.removeFromWatchlist = exports.addToWatchlist = exports.getWatchlist = void 0;
const prisma_1 = require("../lib/prisma");
const error_middleware_1 = require("../middlewares/error.middleware");
const getWatchlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const watchlist = yield prisma_1.prisma.watchlist.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(watchlist);
    }
    catch (err) {
        next(err);
    }
});
exports.getWatchlist = getWatchlist;
const addToWatchlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const symbol = req.params.symbol.toUpperCase();
        const existing = yield prisma_1.prisma.watchlist.findUnique({
            where: { userId_symbol: { userId, symbol } }
        });
        if (existing) {
            throw new error_middleware_1.AppError(400, 'Symbol already in watchlist');
        }
        const item = yield prisma_1.prisma.watchlist.create({
            data: { userId, symbol }
        });
        res.status(201).json(item);
    }
    catch (err) {
        next(err);
    }
});
exports.addToWatchlist = addToWatchlist;
const removeFromWatchlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const symbol = req.params.symbol.toUpperCase();
        yield prisma_1.prisma.watchlist.delete({
            where: { userId_symbol: { userId, symbol } }
        });
        res.json({ message: 'Removed from watchlist' });
    }
    catch (err) {
        if (err.code === 'P2025') {
            next(new error_middleware_1.AppError(404, 'Symbol not in watchlist'));
        }
        else {
            next(err);
        }
    }
});
exports.removeFromWatchlist = removeFromWatchlist;
