import { MarketProvider, StockData } from './MarketProvider';

const MOCK_SYMBOLS = [
    { symbol: 'NABIL', name: 'Nabil Bank Limited', basePrice: 600 },
    { symbol: 'NICA', name: 'NIC Asia Bank', basePrice: 750 },
    { symbol: 'CIT', name: 'Citizen Investment Trust', basePrice: 2100 },
    { symbol: 'NTC', name: 'Nepal Telecom', basePrice: 850 },
    { symbol: 'CBIL', name: 'Citizens Bank', basePrice: 180 },
    { symbol: 'HDL', name: 'Himalayan Distillery', basePrice: 1800 },
    { symbol: 'SHIVM', name: 'Shivam Cements', basePrice: 500 },
    { symbol: 'UPPER', name: 'Upper Tamakoshi', basePrice: 220 },
    { symbol: 'GBIME', name: 'Global IME Bank', basePrice: 190 },
    { symbol: 'EBL', name: 'Everest Bank Limited', basePrice: 530 },
    { symbol: 'SCB', name: 'Standard Chartered Bank', basePrice: 470 },
    { symbol: 'NBL', name: 'Nepal Bank Limited', basePrice: 215 },
    { symbol: 'ADBL', name: 'Agriculture Development Bank', basePrice: 245 },
    { symbol: 'PCAL', name: 'Prime Commercial Bank', basePrice: 185 },
    { symbol: 'SANIMA', name: 'Sanima Bank Limited', basePrice: 222 },
    { symbol: 'SBL', name: 'Siddhartha Bank Limited', basePrice: 250 },
    { symbol: 'NHPC', name: 'National Hydro Power', basePrice: 135 },
    { symbol: 'API', name: 'Api Power Company', basePrice: 165 },
    { symbol: 'CHDC', name: 'Chilime Hydropower', basePrice: 480 },
    { symbol: 'HIDCL', name: 'Hydroelectricity Investment', basePrice: 155 },
    { symbol: 'NIFRA', name: 'Nepal Infrastructure Bank', basePrice: 195 },
    { symbol: 'NLIC', name: 'Nepal Life Insurance', basePrice: 690 },
    { symbol: 'LICN', name: 'Life Insurance Corp', basePrice: 1350 },
    { symbol: 'SICL', name: 'Shikhar Insurance', basePrice: 850 },
    { symbol: 'NIL', name: 'Neco Insurance', basePrice: 810 },
    { symbol: 'NRIC', name: 'Nepal Reinsurance Company', basePrice: 630 },
    { symbol: 'MERO', name: 'Mero Microfinance', basePrice: 620 },
    { symbol: 'CBBL', name: 'Chhimek Laghubitta', basePrice: 940 },
    { symbol: 'STC', name: 'Salt Trading Corporation', basePrice: 4500 }
];

export class MockProvider implements MarketProvider {
    get name(): string {
        return 'MockProvider';
    }

    private currentMockData: Map<string, StockData> = new Map();

    constructor() {
        this.initializeData();
    }

    private initializeData() {
        MOCK_SYMBOLS.forEach(s => {
            this.currentMockData.set(s.symbol, {
                symbol: s.symbol,
                name: s.name,
                price: s.basePrice,
                change: 0,
                changePercent: 0,
                volume: Math.floor(Math.random() * 10000),
                lastUpdated: new Date()
            });
        });
    }

    private fluctuatePrices() {
        this.currentMockData.forEach((data, symbol) => {
            // Fluctuate between -2% and +2%
            const changeFactor = 1 + ((Math.random() - 0.5) * 0.04);
            const newPrice = Number((data.price * changeFactor).toFixed(2));
            const change = Number((newPrice - data.price).toFixed(2));
            const changePercent = Number(((change / data.price) * 100).toFixed(2));

            this.currentMockData.set(symbol, {
                ...data,
                price: newPrice,
                change,
                changePercent,
                volume: data.volume + Math.floor(Math.random() * 500),
                lastUpdated: new Date()
            });
        });
    }

    async fetchAllStocks(): Promise<StockData[]> {
        this.fluctuatePrices();
        return Array.from(this.currentMockData.values());
    }

    async fetchStock(symbol: string): Promise<StockData | null> {
        this.fluctuatePrices();
        return this.currentMockData.get(symbol.toUpperCase()) || null;
    }
}
