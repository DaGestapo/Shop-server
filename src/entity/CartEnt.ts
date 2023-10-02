import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import { User } from './UserEnt';
import { CartItem } from './CartItemEnt';

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
        () => User,
        user => user.cart
    )
    @JoinColumn()
    user: User

    @OneToMany(
        () => CartItem,
        cart_item => cart_item.cart
    )
    cart_item: CartItem;
    
}