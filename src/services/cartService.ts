import { Cart } from "../entity/CartEnt";
import { CartItem } from "../entity/CartItemEnt";
import { CartItemInformation } from "../entity/CartItemInformationEnt";
import dataSource from '../db';
import { Item } from "../entity/ItemEnt";
import { User } from "../entity/UserEnt";

import { TableServices } from "./TableServices";

class CartService extends TableServices{

    public async createCartTable(user: User) {
        const basket = dataSource.manager.create( Cart, {
            user
        });
        await dataSource.manager.save(basket);
    }

    public async cretateCartItemTable(item: Item, cart: Cart) {
        const cartItem = dataSource.manager.create(CartItem, {
            item,
            cart
        });
        await dataSource.manager.save(cartItem);

        return cartItem;
    }

    public async cretateCartItemInformationTable(
        cartItem: CartItem, 
        color: string, 
        size: string,
        quantity?: number
        ) {
       const cartItemInfo = dataSource.manager.create(CartItemInformation, {
            cart_item: cartItem,
            color,
            size,
            quantity
          });
        await dataSource.manager.save(cartItemInfo);
        return cartItemInfo;
    }

    public async findCartItemByItemId(itemId: string) {
        return await dataSource.manager.findOne(CartItem, {
            where: {
               item: {
                id: itemId
               }
            }
          });
    }

    public async findUserCart(userId: string) {
         return await dataSource.manager.findOne(Cart, {
            where: {
                user: {
                    id: userId
                }
            },
            relations: {
                cart_item: {
                    item: true,
                    cart_item_information: true
                },
                
            }
          });
    }

    public async findCartedItemInformationTableByCartedItemIdAndUserId(cartedItemId: string, id: string) {
        return await dataSource.manager.findOne(CartItemInformation, {
            where: {
                cart_item: {
                    id: cartedItemId,
                    cart: {
                        user: {
                            id
                        }
                    }
                },
                
            }
        })
    }

    public async updateQuantityOfCartedItem(quantity: number, cartedItemInformation: CartItemInformation) {
      await dataSource.manager.update(
            CartItemInformation, 
            {id: cartedItemInformation.id},
            {quantity}
        );
    }

}

export default new CartService();