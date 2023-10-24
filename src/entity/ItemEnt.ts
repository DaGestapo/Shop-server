import {BaseEntity, JoinColumn, Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import { Rating } from './RatingEnt';
import { Brand } from './BrandEnt';
import { Type } from './TypeEnt';
import { ItemInfo } from './ItemInfoEnt';
import { Cart } from './CartEnt';
import { ItemImgs } from './ItemImgsEnt';
import { Review } from './ReviewEnt';
import { CartItem } from './CartItemEnt'
import { WishItem } from './WishItem';

@Entity('item')
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        unique: true
    })
    name: string;

    @Column({
        nullable: false,
        default: 0,
    })
    price: number;

    @Column({
        nullable: true,
    })
    priceOff: number;

    @Column({
        nullable: true,
    })
    saleOff: number;

    @Column({
        nullable: false
    })
    img: string;

    @Column({
        nullable: false
    })
    hot: boolean;

    @OneToOne(
        () => ItemImgs,
        item_imgs => item_imgs.item
    )
    item_imgs: ItemImgs;

    @OneToMany(
        () => Rating,
        rating => rating.item
    )
    rating: Rating;

    @ManyToOne(
        () => Type,
        type => type.item
    )
    @JoinColumn()
    type: Type;

    @ManyToOne(
        () => Brand,
        brand => brand.item
    )
    @JoinColumn()
    brand: Brand;

    @OneToOne(
        () => ItemInfo,
        item_info => item_info.item
    )
    item_info: ItemInfo;

    @OneToMany(
        () => CartItem,
        cart_item => cart_item.item
    )
    cart_item: CartItem;

    @OneToMany(
        () => WishItem,
        wish_item => wish_item.item
    )
    wish_item: WishItem;

    @OneToMany(
        () => Review,
        review => review.item
    )
    review: Review[];

}