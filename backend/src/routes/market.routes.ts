import { Router, Request, Response } from 'express';
import { marketService } from '../market/marketService';

const router = Router();

router.get('/stocks', (req: Request, res: Response) => {
    const stocks = marketService.getCachedStocks();
    res.json(stocks);
});

router.get('/stocks/:symbol', (req: Request, res: Response) => {
    const symbol = req.params.symbol as string;
    const stock = marketService.getCachedStock(symbol);

    if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
    }

    res.json(stock);
});

router.get('/stocks/:symbol/history', (req: Request, res: Response) => {
    const symbol = req.params.symbol as string;
    const stock = marketService.getCachedStock(symbol);

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

router.get('/stocks/:symbol/ai-insight', (req: Request, res: Response) => {
    const symbol = req.params.symbol as string;
    const stock = marketService.getCachedStock(symbol);

    if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
    }

    // Generate a contextual but simulated AI insight
    const isPositive = stock.change >= 0;
    const volatility = Math.abs(stock.changePercent);

    let analysis = "";

    if (volatility > 1.5) {
        analysis = isPositive
            ? `DemoTrade AI detects strong bullish momentum for ${stock.symbol}. Huge volume and a breakout above resistance levels suggest the rally could continue in the short term. Proceed with trailing stop losses.`
            : `DemoTrade AI warns of a sharp bearish crossover in ${stock.symbol}'s recent action. High volatility combined with a ${stock.changePercent.toFixed(2)}% drop indicates selling pressure. Wait for a solid floor before buying.`;
    } else {
        analysis = isPositive
            ? `DemoTrade AI observes a steady sideways-to-bullish consolidation for ${stock.symbol}. The stock is slowly gaining ground. Good for long-term accumulation.`
            : `DemoTrade AI notes a minor dip for ${stock.symbol}. The stock is hovering near its support zone. A potential entry point if the broader market stabilizes.`;
    }

    res.json({
        symbol: stock.symbol,
        insight: analysis,
        confidenceScore: Math.floor(Math.random() * 20) + 75, // 75-94%
        sentiment: isPositive ? 'BULLISH' : 'BEARISH'
    });
});

export default router;
