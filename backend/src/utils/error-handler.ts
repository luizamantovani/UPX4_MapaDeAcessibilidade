import { Response } from 'express';
import { logger as pino} from './logger';

class ErrorHandler {
    public async handleError(res: Response, error: Error){
        pino.error({
            message: error.message || 'An unexpected error occurred',
            error,
        });
        if (error instanceof Error) {
            const err =  error as Error & { statusCode?: number };
            res.status(err.statusCode || 500).json({ message: err.message });
            return;
        }

        res.status(500).json({ message: 'An unexpected error occurred' });
    }
}

export const errorHandler = new ErrorHandler();