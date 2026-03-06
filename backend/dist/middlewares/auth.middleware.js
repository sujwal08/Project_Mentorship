"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const error_middleware_1 = require("./error.middleware");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            throw new error_middleware_1.AppError(401, 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = { id: decoded.id };
        next();
    }
    catch (error) {
        next(new error_middleware_1.AppError(401, 'Invalid or expired token'));
    }
};
exports.authenticate = authenticate;
