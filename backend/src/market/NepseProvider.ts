import axios from 'axios';
import { MarketProvider, StockData } from './MarketProvider';

export class NepseProvider implements MarketProvider {
    get name(): string {
        return 'NepseProvider';
    }

    private readonly NEPSE_API_URL = 'https://nepse-data-api.herokuapp.com/api/v1/nots/nepse-data/today-price';

    async fetchAllStocks(): Promise<StockData[]> {
        // The herokuapp is no longer active and returns 404.
        // We will immediately throw to trigger the MarketService fallback to MockProvider
        // without flooding the console with errors.
        throw new Error('NEPSE API is discontinued. Falling back to MockProvider internally.');
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
