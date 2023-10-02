import {BaseEntity, JoinColumn, Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, ManyToMany, OneToOne} from 'typeorm';
import { Type } from './TypeEnt';
import { Item } from './ItemEnt';

@Entity('brand')
export class Brand extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        unique: true
    })
    name: string;

    @ManyToMany(
        () => Type,
        type => type.brand
    )
    type: Type;

    @OneToMany(
        () => Item,
        item => item.brand
    )
    item: Item;
}