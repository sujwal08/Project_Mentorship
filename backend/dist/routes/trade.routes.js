"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trade_controller_1 = require("../controllers/trade.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const trade_dto_1 = require("../dto/trade.dto");
const router = (0, express_1.Router)();
// All trading routes are protected
router.use(auth_middleware_1.authenticate);
router.get('/portfolio', trade_controller_1.getPortfolio);
router.post('/buy', (0, validate_middleware_1.validateDTO)(trade_dto_1.tradeSchema), (0, trade_controller_1.executeTrade)('BUY'));
router.post('/sell', (0, validate_middleware_1.validateDTO)(trade_dto_1.tradeSchema), (0, trade_controller_1.executeTrade)('SELL'));
router.get('/history', trade_controller_1.getTradeHistory);
exports.default = router;
