import {BaseEntity, JoinColumn, Column, PrimaryGeneratedColumn, Entity, ManyToMany, JoinTable, OneToOne, OneToMany} from 'typeorm';
import { Brand } from './BrandEnt';
import { Item } from './ItemEnt';

@Entity()
export class Type extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        unique: true
    })
    name: string;

    @ManyToMany(
        () => Brand,
        brand => brand.type
    )
    @JoinTable()
    brand: Brand[];

    @OneToMany(
        () => Item,
        item => item.type
    )
    item: Item;
}