export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    lastUpdated: Date;
}

export interface MarketProvider {
    /**
     * Fetch all stocks currently trading or available.
     */
    fetchAllStocks(): Promise<StockData[]>;

    /**
     * Fetch data for a specific stock symbol.
     */
    fetchStock(symbol: string): Promise<StockData | null>;

    /**
     * Name of the provider (for logging and fallback logic)
     */
    get name(): string;
}
