import winston from "winston";
import config from "../config.js";

const customLevels = {
    levels: {
        debug: 0,
        http: 1,
        information: 2,
        warning: 3,
        error: 4,
        fatal: 5,
    },
    colors: {
        debug: "blue",
        http: "blue",
        information: "green",
        warning: "yellow",
        error: "red",
        fatal: "red",
    },
};

export let logger;

if (config.ENVIRONMENT === "production") { 
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports:[
            new winston.transports.Console({
                level: "information",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevels.colors}),
                    winston.format.simple()
                ),
            }),
            new winston.transports.File({
                level: "error",
                filename: "errors.log",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint()
                ),
            }),
        ],
    });
}else{
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console({ 
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({ all: true }), 
                    winston.format.simple() 
                ),
            }),
        ],
    });
}

