import {Column, Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn} from 'typeorm';

@Entity('news')
export class News extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    img: string;

    @Column({
        nullable: false,
        unique: true
    })
    title: string;

    @Column({
        nullable: false
    })
    description: string;

    @CreateDateColumn()
    createdDate: Date;
}