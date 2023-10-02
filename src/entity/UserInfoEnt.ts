import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm"
import { User } from "./UserEnt";

@Entity('user_info')
export class UserInfo extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({
        nullable: true
    })
    gender: string;

    @Column({
        nullable: false
    })
    username: string;

    @Column({
        nullable: true
    })
    img: string;

    @Column({
        nullable:true
    })
    age: number;

    @OneToOne(
        () => User,
        user => user.user_info,
    )
    @JoinColumn()
    user: User;
}