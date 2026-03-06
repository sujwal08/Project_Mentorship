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
exports.marketService = void 0;
const NepseProvider_1 = require("./NepseProvider");
const MockProvider_1 = require("./MockProvider");
class MarketService {
    constructor() {
        this.cache = new Map();
        this.isPolling = false;
        this.io = null;
        this.pollIntervalMs = 5000; // Poll every 5 seconds
        this.nepseProvider = new NepseProvider_1.NepseProvider();
        this.mockProvider = new MockProvider_1.MockProvider();
        // Default to Mock for safety during init, we will try Nepse on first poll
        this.provider = this.mockProvider;
    }
    startPolling(ioServer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPolling)
                return;
            this.io = ioServer;
            this.isPolling = true;
            console.log(`[MarketService] Starting market polling...`);
            this.pollLoop();
        });
    }
    pollLoop() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.isPolling) {
                yield this.updateMarketData();
                yield new Promise(resolve => setTimeout(resolve, this.pollIntervalMs));
            }
        });
    }
    updateMarketData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt NEPSE first
                let data;
                try {
                    data = yield this.nepseProvider.fetchAllStocks();
                    if (this.provider.name !== this.nepseProvider.name) {
                        console.log(`[MarketService] Switching to ${this.nepseProvider.name}`);
                        this.provider = this.nepseProvider;
                    }
                }
                catch (err) {
                    // Fallback to Mock
                    if (this.provider.name !== this.mockProvider.name) {
                        console.log(`[MarketService] NEPSE failed. Falling back to ${this.mockProvider.name}`);
                        this.provider = this.mockProvider;
                    }
                    data = yield this.mockProvider.fetchAllStocks();
                }
                // Update Cache
                data.forEach(stock => {
                    this.cache.set(stock.symbol, stock);
                });
                // Broadcast to clients
                if (this.io) {
                    this.io.emit('market:update', Array.from(this.cache.values()));
                }
            }
            catch (error) {
                console.error('[MarketService] Critical error in update loop:', error);
            }
        });
    }
    getCachedStocks() {
        return Array.from(this.cache.values());
    }
    getCachedStock(symbol) {
        return this.cache.get(symbol.toUpperCase()) || null;
    }
}
exports.marketService = new MarketService();
