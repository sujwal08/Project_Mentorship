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
exports.getMe = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
const error_middleware_1 = require("../middlewares/error.middleware");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new error_middleware_1.AppError(400, 'User already exists');
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma_1.prisma.user.create({
            data: {
                email,
                passwordHash,
                portfolio: {
                    create: {
                        balance: 100000.0, // Initial 100k virtual balance
                    }
                }
            },
            include: {
                portfolio: true
            }
        });
        const token = (0, jwt_1.signToken)({ id: user.id });
        res.status(201).json({
            token,
            user: { id: user.id, email: user.email },
            portfolio: user.portfolio
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new error_middleware_1.AppError(401, 'Invalid credentials');
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new error_middleware_1.AppError(401, 'Invalid credentials');
        }
        const token = (0, jwt_1.signToken)({ id: user.id });
        res.status(200).json({
            token,
            user: { id: user.id, email: user.email }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, createdAt: true, portfolio: true }
        });
        if (!user) {
            throw new error_middleware_1.AppError(404, 'User not found');
        }
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.getMe = getMe;
