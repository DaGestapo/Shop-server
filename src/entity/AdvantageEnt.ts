import {Entity, BaseEntity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('advantage')
export class Advantage extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        unique: true
    })
    title: string;

    @Column({
        nullable: false
    })
    description: string

    @Column({
        nullable: false,
    })
    img: string;
}