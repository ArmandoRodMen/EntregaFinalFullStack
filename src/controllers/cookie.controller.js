import { logger } from "../utils/logger.js";

export const viewCookie = async (req, res) => {
    logger.information("Cookies:", req.cookies);
    res.send("View cookies in log");
};