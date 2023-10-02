import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, OneToOne } from "typeorm";
import { CartItem } from "./CartItemEnt";

@Entity('cart_item_information')
export class CartItemInformation extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @Column({
        nullable: false
    })
    size: string;

    @Column({
        nullable: false
    })
    color: string;

    @Column({
        nullable: false,
        default: 1
    })
    quantity: number;

    @OneToOne(
        () => CartItem,
        cart_item => cart_item.cart_item_information
    )
    cart_item: CartItem;

}