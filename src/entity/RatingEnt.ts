import {BaseEntity, JoinColumn, Column, PrimaryGeneratedColumn, Entity, ManyToOne} from 'typeorm';
import {User} from './UserEnt';
import { Item } from './ItemEnt';

@Entity()
export class Rating extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    rate: number;

    @ManyToOne(
        () => User,
        user => user.rating
    )
    @JoinColumn()
    user: User; 

    @ManyToOne(
        () => Item,
        item => item.rating
    )
    @JoinColumn()
    item: Item;
}