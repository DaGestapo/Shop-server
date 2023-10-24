import { Cart } from "../entity/CartEnt";
import { CartItem } from "../entity/CartItemEnt";
import { CartItemInformation } from "../entity/CartItemInformationEnt";
import dataSource from '../db';
import { Item } from "../entity/ItemEnt";
import { Wish } from "../entity/WishEnt";
import { User } from "../entity/UserEnt";
import { WishItem } from "../entity/WishItem";

class WishService {

    public async createWhishTable(user: User) {
        const wish = dataSource.manager.create(Wish, {user});
        await dataSource.manager.save(wish);
    }

    public async cretateWishItemTable(item: Item, wish: Wish) {
        const wishTableItem = dataSource.manager.create(WishItem, {item, wish});

        return await dataSource.manager.save(wishTableItem);
    }
    
    public async findWishItemByWishItemId(wishItemId: string, userId: string) {
        return await dataSource.manager.findOne(WishItem, {
            where: {
                id: wishItemId,
                wish: {
                    user: {
                        id: userId
                    }
                }
            }
        })
    }

    public async findUserWishTable(userId: string) {
         return await dataSource.manager.findOne(Wish, {
            where: {
                user: {
                    id: userId
                }
            }
         })
    }

    public async findUserWishItems(userId: string) {
        return await dataSource.manager.find(WishItem, {
            where: {
                wish: {
                    user: {
                        id: userId
                    }
                }
            },
            relations: {
                item: {
                    item_info: true,
                }
                
            }
        })
   }

    public async deleteWishItem(wishItem: WishItem) {
        return await dataSource.manager.delete(WishItem, wishItem);
    }
}

export default new WishService();