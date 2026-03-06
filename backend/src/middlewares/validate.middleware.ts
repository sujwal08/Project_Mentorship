import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodTypeAny, ZodError } from 'zod';

export const validateDTO = (schema: ZodObject<any, any> | ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    issues: error.issues.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
                });
            }
            next(error);
        }
    };
};
