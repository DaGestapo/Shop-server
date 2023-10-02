import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import dataSource from '../db';
import { Review } from "../entity/ReviewEnt";
import { Item } from "../entity/ItemEnt";
import { User } from "../entity/UserEnt";
import { Rating } from "../entity/RatingEnt";

import rateService from "../services/rateService";
import userService from "../services/userService";
import itemService from "../services/itemService";

export interface RateI {
    id: string;
    itemId: string;
    rate: string; // Change to Number 
}

class rateController {
    public async create(req: Request, res: Response, next: NextFunction) {
       try {
           let {id, itemId, rate}: RateI = req.body;

           const rateNumber: number | null = Number(rate) || null;

           if(!rateNumber) {
                return next(ApiError.badRequest('Не введен рейтинг!'));
           }
           if(!itemId) {
            return next(ApiError.badRequest('Неверный id товара!'));
           }
           const item = await itemService.findOneTableById(itemId);
           const user = await userService.findUserTableById(id);

           if(!item) {
            return next(ApiError.badRequest('Данного товара не существует!'));
           }
           if(!user) {
            return next(ApiError.badRequest('Данного товара не существует!'));
           }
           const rateCandidat = await rateService.findRateByUserItemId(user.id, item.id );
           if(rateCandidat) {
                return next(ApiError.badRequest('Вы уже ставили оценку данномуц товару!'));
           }

           const rateTable = await rateService.createRatingTable(rateNumber, user, item);

           return res.json({rate: rateTable});
           
       } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
       }

    }


    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            let {id, itemId} = req.body;

            if(!itemId) {
                return next(ApiError.badRequest('Неверный id товара!'));
            }

            const rate = await rateService.findRateByUserItemId(id, itemId);

            if(!rate) {
                return next(ApiError.badRequest('Не удалось найти ваш рейтинг по данному товару!'));
            }

            const deleteResult = await rateService.deleteUserRateById(rate);

            if(deleteResult) {
                res.json({message: 'Ваша оценкка успешно удалена!'});
            } else {
                res.json({message: 'Не удалось стереть ваш отзыв!'});
            }
        
           
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }
}

export default new rateController();