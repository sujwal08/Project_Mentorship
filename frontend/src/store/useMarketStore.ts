import { create } from 'zustand';
import { api } from '../api/axios';
import { socket } from '../socket/socket';

export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    lastUpdated: string;
}

interface MarketState {
    stocks: StockData[];
    isLoading: boolean;
    fetchInitialStocks: () => Promise<void>;
    initializeSocketEvents: () => void;
}

export const useMarketStore = create<MarketState>((set) => ({
    stocks: [],
    isLoading: true,
    fetchInitialStocks: async () => {
        try {
            const res = await api.get('/market/stocks');
            set({ stocks: res.data, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch initial stocks', error);
            set({ isLoading: false });
        }
    },
    initializeSocketEvents: () => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.on('market:update', (data: StockData[]) => {
            set({ stocks: data });
        });

        return () => {
            socket.off('market:update');
        };
    }
}));
