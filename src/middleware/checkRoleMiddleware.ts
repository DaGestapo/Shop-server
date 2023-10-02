import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import verifyTokenUtile from "../utils/verifyTokenUtile";


export default (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = verifyTokenUtile(req, res, next);
        
        if(!user ||  user.role !== role ) {
            next(ApiError.unauthorized('Не авторизован'));
        } else {
            next();
        }
    }
    
}
