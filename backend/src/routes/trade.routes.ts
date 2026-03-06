import { Router } from 'express';
import { getPortfolio, executeTrade, getTradeHistory } from '../controllers/trade.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateDTO } from '../middlewares/validate.middleware';
import { tradeSchema } from '../dto/trade.dto';

const router = Router();

// All trading routes are protected
router.use(authenticate);

router.get('/portfolio', getPortfolio);
router.post('/buy', validateDTO(tradeSchema), executeTrade('BUY'));
router.post('/sell', validateDTO(tradeSchema), executeTrade('SELL'));
router.get('/history', getTradeHistory);

export default router;
