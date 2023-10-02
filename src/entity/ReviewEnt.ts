import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./UserEnt";
import { Item } from "./ItemEnt";

@Entity('review')
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false
    })
    review: string;

    @ManyToOne(
        () => User,
        user => user.review
    )
    @JoinColumn()
    user: User;

    @ManyToOne(
        () => Item,
        item => item.review
    )
    @JoinColumn()
    item: Item;
}
