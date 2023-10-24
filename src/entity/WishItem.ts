import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, BaseEntity, ManyToOne, OneToMany} from 'typeorm';
import { Cart } from './CartEnt';
import {Item} from './ItemEnt';
import {CartItemInformation} from './CartItemInformationEnt';
import { Wish } from './WishEnt';

@Entity('wish_item') 
export class WishItem extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Wish,
        wish => wish.wish_item
    )
    @JoinColumn()
    wish: Wish;

    @ManyToOne(
        () => Item,
        item => item.wish_item
    )
    @JoinColumn()
    item: Item;

}