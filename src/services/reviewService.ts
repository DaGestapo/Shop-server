import dataSource from '../db';
import { Item } from '../entity/ItemEnt';
import { User } from '../entity/UserEnt';
import { Review } from '../entity/ReviewEnt';


class ReviewService {

    public async findReviewTableById(reviewId: string) {
        return await dataSource.manager.findOne(Review, {
            where: {
                id: reviewId
            }
        })
    }

    public async createReview(user: User, item: Item, review: string) {
       const result = dataSource.manager.create(Review, {
            item,
            user,
            review
        });
        await dataSource.manager.save(result);
        if(result) {
            return result;
        }
        return null;
    }

    public async getReviweByItemId(itemId: string) {
        return await dataSource.manager.find(Review, {
            where: {
                item: {
                    id: itemId
                },
                
            },
            relations: {
                user: {
                    user_info: true,
                    rating: true
                }
            }
        })
    }

    public async getAllReviewAndRating() {
        return await dataSource.manager.find(Review, {
            relations: {
                user: {
                    rating: true
                }
            }
        });
    }

    public async deleteReviewByUser(user: User) {
        return await dataSource.manager.delete(Review, {
            user
        });
    } 

    public async updateReview(review: Review, text: string) {
       return await dataSource.manager.update(
            Review, 
            {id: review.id},
            {review: text}
        )
    }

    public async findReviewByUserAndItem(user: User, item: Item) {
        return await dataSource.manager.findOne(Review, {
          where: {
            user: {
                id: user.id
            }, 
            item: {
                id: item.id
            }
          }
        })
    }
}

export default new ReviewService();