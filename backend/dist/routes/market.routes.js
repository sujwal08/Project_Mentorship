"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marketService_1 = require("../market/marketService");
const router = (0, express_1.Router)();
router.get('/stocks', (req, res) => {
    const stocks = marketService_1.marketService.getCachedStocks();
    res.json(stocks);
});
router.get('/stocks/:symbol', (req, res) => {
    const symbol = req.params.symbol;
    const stock = marketService_1.marketService.getCachedStock(symbol);
    if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(stock);
});
router.get('/stocks/:symbol/history', (req, res) => {
    const symbol = req.params.symbol;
    const stock = marketService_1.marketService.getCachedStock(symbol);
    if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
    }
    // Generate 30 days of mock history based on the current price
    // We walk backwards from the current price so the chart perfectly matches the live price.
    const history = [];
    let pricePath = [stock.price];
    // Generate backwards
    for (let i = 1; i <= 30; i++) {
        // Random daily fluctuation between -1.5% and +1.5% to create a realistic trend
        // Adding a slight upward bias or momentum could also work, but random walk is fine
        const changePercent = (Math.random() * 3) - 1.5;
        const previousPrice = pricePath[0] / (1 + (changePercent / 100));
        pricePath.unshift(Number(previousPrice.toFixed(2)));
    }
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        history.push({
            date: date.toISOString().split('T')[0],
            price: pricePath[30 - i],
            volume: Math.floor(Math.random() * 50000) + 1000
        });
    }
    res.json(history);
});
exports.default = router;
