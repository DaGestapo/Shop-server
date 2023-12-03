import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";

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
                return next(ApiError.badRequest('No rating entered!'));
            }
            if(rateNumber < 0 || rateNumber > 5) {
                return next(ApiError.badRequest('The acceptable score is in the range from 0 to 5!'));
            }
            if(!itemId) {
                return next(ApiError.badRequest('Invalid product ID!'));
            }

            const item = await itemService.findOneTableById(itemId);
            const user = await userService.findUserTableById(id);

            if(!item) {
                return next(ApiError.badRequest('This product does not exist!'));
            }
            if(!user) {
                return next(ApiError.badRequest('This product does not exist!'));
            }

            const rateCandidat = await rateService.findRateByUserItemId(user.id, item.id);
            if(rateCandidat) {
                return next(ApiError.badRequest('You have already rated this product!'));
            }

            const rateTable = await rateService.createRatingTable(rateNumber, user, item);
            return res.json(rateTable);
            
       } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
       }

    }

    public async getRatingsByItemId(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params; //itemId
            const ratings = await rateService.findRatingsByItemId(id);
    
            return res.json(ratings);   
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }


    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            let {id, itemId} = req.body;
            if(!itemId) {
                return next(ApiError.badRequest('Invalid product ID!'));
            }

            const rate = await rateService.findRateByUserItemId(id, itemId);
            if(!rate) {
                return next(ApiError.badRequest('I could not find your rating for this product!'));
            }

            const deleteResult = await rateService.deleteUserRateById(rate);
            if(deleteResult) {
                return res.json({message: 'Your score has been successfully deleted!'});
            } else {
                return next(ApiError.badRequest(`Couldn't erase your review!`));
            }
           
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }
}

export default new rateController();