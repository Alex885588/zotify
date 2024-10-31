import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { LoggerService } from "src/services/logger.service";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private readonly loggerService: LoggerService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const startTime = Date.now();
        const { method, originalUrl } = req;

        const startTimestamp = new Date().toISOString();
        this.loggerService.log(`Start Time: ${startTimestamp} | Method: ${method} | URL: ${originalUrl}`);
        res.on('finish', () => {
            const endTime = Date.now();
            const endTimestamp = new Date().toISOString();
            const timeTaken = endTime - startTime;

            this.loggerService.log(`End Time: ${endTimestamp} | Method: ${method} | URL: ${originalUrl} | Time Taken: ${timeTaken}ms`);
        });

        next();
    }
}
