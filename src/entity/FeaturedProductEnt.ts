import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('featured_item')
export class FeaturedItem extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        unique: true
    })
    title: string;

    @Column({
        nullable: false,
    })
    price: string;

    @Column({
        nullable: true
    })
    priceOff: string;

    @Column({
        nullable: false
    })
    img: string;
}