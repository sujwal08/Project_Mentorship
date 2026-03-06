import axios from 'axios';
import { MarketProvider, StockData } from './MarketProvider';

export class NepseProvider implements MarketProvider {
    get name(): string {
        return 'NepseProvider';
    }

    private readonly NEPSE_API_URL = 'https://nepse-data-api.herokuapp.com/api/v1/nots/nepse-data/today-price';

    async fetchAllStocks(): Promise<StockData[]> {
        try {
            const response = await axios.get(this.NEPSE_API_URL, { timeout: 5000 });
            const data = response.data;
            if (!Array.isArray(data)) {
                throw new Error('Invalid NEPSE data format');
            }

            return data.map((item: any) => ({
                symbol: item.symbol,
                name: item.companyName || item.symbol,
                price: Number(item.lastTradedPrice || 0),
                change: Number(item.schange || 0),
                changePercent: Number(item.percentageChange || 0),
                volume: Number(item.totalTradeQuantity || 0),
                lastUpdated: new Date()
            }));
        } catch (error: any) {
            console.error(`[NepseProvider] Failed to fetch all stocks:`, error.message);
            throw error;
        }
    }

    async fetchStock(symbol: string): Promise<StockData | null> {
        try {
            const allStocks = await this.fetchAllStocks();
            const stock = allStocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
            return stock || null;
        } catch (error: any) {
            console.error(`[NepseProvider] Failed to fetch stock ${symbol}:`, error.message);
            throw error;
        }
    }
}
