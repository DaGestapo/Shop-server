import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn} from "typeorm";
import { Item } from "./ItemEnt";



@Entity('item_imgs')
export class ItemImgs extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false
    })
    img: string;

    @OneToOne(
        () => Item,
        item => item.item_imgs
    )
    @JoinColumn()
    item: Item;

}