import { Server } from 'socket.io';
import { MarketProvider, StockData } from './MarketProvider';
import { NepseProvider } from './NepseProvider';
import { MockProvider } from './MockProvider';

class MarketService {
    private provider: MarketProvider;
    private nepseProvider: NepseProvider;
    private mockProvider: MockProvider;
    private cache: Map<string, StockData> = new Map();
    private isPolling = false;
    private io: Server | null = null;
    private pollIntervalMs = 5000; // Poll every 5 seconds

    constructor() {
        this.nepseProvider = new NepseProvider();
        this.mockProvider = new MockProvider();
        // Default to Mock for safety during init, we will try Nepse on first poll
        this.provider = this.mockProvider;
    }

    public async startPolling(ioServer: Server) {
        if (this.isPolling) return;
        this.io = ioServer;
        this.isPolling = true;

        this.pollLoop();
    }

    private async pollLoop() {
        while (this.isPolling) {
            await this.updateMarketData();
            await new Promise(resolve => setTimeout(resolve, this.pollIntervalMs));
        }
    }

    private async updateMarketData() {
        try {
            // Attempt NEPSE first
            let data: StockData[];
            try {
                data = await this.nepseProvider.fetchAllStocks();
                if (this.provider.name !== this.nepseProvider.name) {
                    this.provider = this.nepseProvider;
                }
            } catch (err) {
                // Fallback to Mock
                if (this.provider.name !== this.mockProvider.name) {
                    this.provider = this.mockProvider;
                }
                data = await this.mockProvider.fetchAllStocks();
            }

            // Update Cache
            data.forEach(stock => {
                this.cache.set(stock.symbol, stock);
            });

            // Broadcast to clients
            if (this.io) {
                this.io.emit('market:update', Array.from(this.cache.values()));
            }
        } catch (error) {
            console.error('[MarketService] Critical error in update loop:', error);
        }
    }

    public getCachedStocks(): StockData[] {
        return Array.from(this.cache.values());
    }

    public getCachedStock(symbol: string): StockData | null {
        return this.cache.get(symbol.toUpperCase()) || null;
    }
}

export const marketService = new MarketService();
