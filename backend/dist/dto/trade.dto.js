"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeSchema = void 0;
const zod_1 = require("zod");
exports.tradeSchema = zod_1.z.object({
    body: zod_1.z.object({
        symbol: zod_1.z.string().min(1, 'Symbol is required'),
        quantity: zod_1.z.number().int().positive('Quantity must be a positive integer'),
    }),
});
