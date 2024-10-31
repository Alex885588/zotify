import { Injectable, LoggerService as NestLogger } from "@nestjs/common";
import { Logger, createLogger, format, transports } from "winston";

@Injectable()
export class LoggerService implements NestLogger {
    private readonly logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: "application.log" })
            ]
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace: string) {
        this.logger.error(message, trace);
    }

    warn(message: string) {
        this.logger.warn(message);
    }
}
