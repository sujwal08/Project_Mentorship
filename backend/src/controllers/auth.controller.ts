import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { signToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError(400, 'User already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
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

        const token = signToken({ id: user.id });

        res.status(201).json({
            token,
            user: { id: user.id, email: user.email },
            portfolio: user.portfolio
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new AppError(401, 'Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new AppError(401, 'Invalid credentials');
        }

        const token = signToken({ id: user.id });

        res.status(200).json({
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, createdAt: true, portfolio: true }
        });

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};
