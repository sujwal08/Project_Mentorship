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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NepseProvider = void 0;
const axios_1 = __importDefault(require("axios"));
class NepseProvider {
    constructor() {
        this.NEPSE_API_URL = 'https://nepse-data-api.herokuapp.com/api/v1/nots/nepse-data/today-price';
    }
    get name() {
        return 'NepseProvider';
    }
    fetchAllStocks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(this.NEPSE_API_URL, { timeout: 5000 });
                const data = response.data;
                if (!Array.isArray(data)) {
                    throw new Error('Invalid NEPSE data format');
                }
                return data.map((item) => ({
                    symbol: item.symbol,
                    name: item.companyName || item.symbol,
                    price: Number(item.lastTradedPrice || 0),
                    change: Number(item.schange || 0),
                    changePercent: Number(item.percentageChange || 0),
                    volume: Number(item.totalTradeQuantity || 0),
                    lastUpdated: new Date()
                }));
            }
            catch (error) {
                console.error(`[NepseProvider] Failed to fetch all stocks:`, error.message);
                throw error;
            }
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
