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
            const item = await itemService.findOneTableById(itemId);
            const user = await userService.findUserTableById(id);

            if(!reviewText) {
                return next(ApiError.badRequest('Your review is empty!'));
            }
            if(!item) {
                return next(ApiError.badRequest('Invalid product id or product does not exist!'));
            }
            if(!user) {
                return next(ApiError.badRequest('The user does not exist!'));
            }

            const reviewCandidat = await reviewService.findReviewByUserAndItem(user, item);
            if(reviewCandidat) {
                return next(ApiError.badRequest('You have already written a review!'));
            }

            const review = await reviewService.createReview(user, item, reviewText);

            return res.json({review});

       } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
       }

    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const reviews = await reviewService.getReviweByItemId(id);
            const response = [];

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
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async changeReview(req: Request, res: Response, next: NextFunction) {
        try {
            const {reviewText, id, reviewId} = req.body;

            if(!reviewText) {
                return next(ApiError.badRequest('Your review is empty!'));
            }   
            const review = await reviewService.findReviewTableById(reviewId);
            if(!review) {
                return next(ApiError.badRequest('The review was not found!'));
            }
            const update = await reviewService.updateReview(review, reviewText);

            res.json();
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;
            if(!id) {
                return next(ApiError.badRequest('Invalid id!'));
            }

            const user = await userService.findUserTableById(id);
            if(!user) {
                return next(ApiError.badRequest('The user does not exist!'));
            }

            const review = await reviewService.deleteReviewByUser(user);

            return res.json({review});
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }
}

export default new ReviewController();