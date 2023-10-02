import dataSource from '../db';
import { Item } from '../entity/ItemEnt';
import { User } from '../entity/UserEnt';
import { Review } from '../entity/ReviewEnt';


class ReviewService {

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

    public async getAllReview() {
        return await dataSource.manager.find(Review);
    }

    public async deleteReviewByUser(user: User) {
        return await dataSource.manager.delete(Review, {
            user
        });
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