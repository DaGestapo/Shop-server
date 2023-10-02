import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import jwt, {JwtPayload} from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction): JwtPayload | void => {
    if(req.method === 'OPTIONS') next();
    
        if(!req.headers.authorization || !process.env.SECRET_KEY) {  
            next(ApiError.unauthorized('Не авторизован'));
        } else {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const user = jwt.verify(token, process.env.SECRET_KEY);

            if(typeof(user) === 'string') {
                next(ApiError.unauthorized('Не авторизован'));
            } else {
                return user;
            }
        }
}