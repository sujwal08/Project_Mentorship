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
exports.NepseProvider = void 0;
class NepseProvider {
    constructor() {
        this.NEPSE_API_URL = 'https://nepse-data-api.herokuapp.com/api/v1/nots/nepse-data/today-price';
    }
    get name() {
        return 'NepseProvider';
    }
    fetchAllStocks() {
        return __awaiter(this, void 0, void 0, function* () {
            // The herokuapp is no longer active and returns 404.
            // We will immediately throw to trigger the MarketService fallback to MockProvider
            // without flooding the console with errors.
            throw new Error('NEPSE API is discontinued. Falling back to MockProvider internally.');
        });
    }
    fetchStock(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allStocks = yield this.fetchAllStocks();
                const stock = allStocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
                return stock || null;
            }
            catch (error) {
                console.error(`[NepseProvider] Failed to fetch stock ${symbol}:`, error.message);
                throw error;
            }
        });
    }
}
exports.NepseProvider = NepseProvider;
