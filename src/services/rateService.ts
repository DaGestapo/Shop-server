import dataSource from '../db';
import { Item } from '../entity/ItemEnt';
import { Rating } from '../entity/RatingEnt';
import { User } from '../entity/UserEnt';


class RateService {

    public async createRatingTable (rate: number, user: User, item: Item) {
        const rateTable = dataSource.manager.create( Rating, {
            rate,
            user,
            item
           });
        return await dataSource.manager.save(rateTable);
    }

    public async findRatingsByItemId(itemId: string) {
        return await dataSource.manager.find(Rating, {
            where: {
                item: {
                    id: itemId
                }
            }
        })
    }

    public async findRateByUserItemId(userId: string, itemId: string) {
        return await dataSource.manager.findOne(Rating, {
            where: {
                user: {
                    id: userId
                },
                item: {
                    id: itemId
                }
            }
        });      

    }

    public async deleteUserRateById(rate: Rating) {
        const deleteResult = await dataSource.manager.delete(Rating, rate);
        if(deleteResult) {
            return true;
        } 
        return false;

    }

}

export default new RateService();