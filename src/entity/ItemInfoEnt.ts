import {BaseEntity, JoinColumn, Column, PrimaryGeneratedColumn, Entity, ManyToOne} from 'typeorm';
import { Item } from './ItemEnt';

@Entity('item-info')
export class ItemInfo extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false
    })
    description: string;

    @Column({
        nullable: false
    })
    colors: string;

    @Column({
        nullable: false,
        default: true
    })
    available: boolean;

    @Column({
        nullable: false
    })
    sizes: string;

    @ManyToOne(
        () => Item,
        item => item.item_info
    )
    @JoinColumn()
    item: Item;
}