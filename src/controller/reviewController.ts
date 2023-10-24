import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";

import reviewService from "../services/reviewService";
import userService from "../services/userService";
import itemService from "../services/itemService";

export interface ReviewI {
    reviewText: string;
    id: string;
    itemId: string; 
}

class ReviewController {
    public async create(req: Request, res: Response, next: NextFunction) {
       try {
            const {reviewText, id, itemId}: ReviewI = req.body;

            if(!reviewText) {
                return next(ApiError.badRequest('Нужно написать обзор!'));
            }
            const item = await itemService.findOneTableById(itemId);
            const user = await userService.findUserTableById(id);

            if(!item) {
                return next(ApiError.badRequest('Неверный id товара или товара не существует!'));
            }
            if(!user) {
                return next(ApiError.badRequest('Пользователя не существует!'));
            }

            const reviewCandidat = await reviewService.findReviewByUserAndItem(user, item);
            if(reviewCandidat) {
                return next(ApiError.badRequest('Вы уже писали обзор!'));
            }

            const review = await reviewService.createReview(user, item, reviewText);

            return res.json({review});


       } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
       }

    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            
            const reviews = await reviewService.getReviweByItemId(id);

            let response = [];

            if(reviews) {
                for(let i = 0; i < reviews.length; i++) {
                    const review = reviews[i];

                    const responseObj = {
                        id: review.id,
                        review: review.review,
                        user: {
                            id: review.user.id,
                            username: review.user.username,
                            email: review.user.email,
                            img: review.user.user_info.img
                        },
    
                    }

                    response.push(responseObj);
                }
                return res.json(response);
            }
            return res.json([]);

            
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;
            if(!id) {
                return next(ApiError.badRequest('Не введен id!'));
            }

            const user = await userService.findUserTableById(id);
            if(!user) {
                return next(ApiError.badRequest('Пользователя не существует!'));
            }

            const review = await reviewService.deleteReviewByUser(user);

            return res.json({review});
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }
}

export default new ReviewController();