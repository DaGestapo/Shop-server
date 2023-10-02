import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, BaseEntity, ManyToOne, OneToMany} from 'typeorm';
import { Cart } from './CartEnt';
import {Item} from './ItemEnt';
import {CartItemInformation} from './CartItemInformationEnt';

@Entity('cart_item') 
export class CartItem extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Cart,
        cart => cart.cart_item
    )
    @JoinColumn()
    cart: Cart;

    @ManyToOne(
        () => Item,
        item => item.cart_item
    )
    @JoinColumn()
    item: Item;

    @OneToOne(
        () => CartItemInformation,
        cart_item_information => cart_item_information.cart_item
    )
    @JoinColumn()
    cart_item_information: CartItemInformation

}