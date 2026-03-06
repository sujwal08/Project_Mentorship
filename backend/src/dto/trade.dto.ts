import { z } from 'zod';

export const tradeSchema = z.object({
    body: z.object({
        symbol: z.string().min(1, 'Symbol is required'),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
    }),
});
