import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import verifyTokenUtile from "../utils/verifyTokenUtile";

export default (req: Request, res: Response, next: NextFunction) => {
    const user = verifyTokenUtile(req, res, next);
    
    if(!user) {
        next(ApiError.unauthorized('Не авторизован'));
    } else {
        req.body = {...req.body, ...user};
        next();
    }
}
