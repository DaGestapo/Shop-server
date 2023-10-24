import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import { User } from './UserEnt';
import { CartItem } from './CartItemEnt';
import { WishItem } from './WishItem';

@Entity('wish')
export class Wish {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
        () => User,
        user => user.wish
    )
    @JoinColumn()
    user: User

    @OneToMany(
        () => WishItem,
        wish_item => wish_item.wish
    )
    wish_item: WishItem;
    
}