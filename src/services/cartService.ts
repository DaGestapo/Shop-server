import { Cart } from "../entity/CartEnt";
import { CartItem } from "../entity/CartItemEnt";
import { CartItemInformation } from "../entity/CartItemInformationEnt";
import dataSource from '../db';
import { Item } from "../entity/ItemEnt";

class CartService {

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

    public async findCartItemByItemId(cartedItemId: string) {
        return await dataSource.manager.findOne(CartItem, {
            where: {
               id: cartedItemId
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

    public async deleteCartedItem(cartedItem: CartItem) {
        return await dataSource.manager.delete(CartItem, cartedItem);
    }
}

export default new CartService();