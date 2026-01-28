/**
 * Global error handling middleware for Express
 * Catches all errors and returns standardized responses
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';

/**
 * Global error handler middleware
 * Must be registered AFTER all routes in server.ts
 * 
 * Preserves existing API error format: { error: string }
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // If response already sent, delegate to default Express handler
    if (res.headersSent) {
        return next(err);
    }

    // Handle our custom AppError types
    if (err instanceof AppError) {
        const statusCode = err.statusCode || 500;

        // For ValidationError, include field details if needed
        // But preserve simple { error: string } format for compatibility
        if (err instanceof ValidationError && err.fields) {
            res.status(statusCode).json({
                error: err.message,
                fields: err.fields
            });
            return;
        }

        // Standard error response
        res.status(statusCode).json({
            error: err.message
        });
        return;
    }

    // Handle unexpected errors (non-operational)
    console.error('Unexpected error:', err);

    res.status(500).json({
        error: 'Internal server error'
    });
}

/**
 * Async handler wrapper to catch promise rejections
 * Usage: router.get('/path', asyncHandler(async (req, res) => {...}))
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}