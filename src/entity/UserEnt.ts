import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinTable} from "typeorm"
import { Cart } from "./CartEnt";
import { UserInfo } from "./UserInfoEnt";
import { Rating } from "./RatingEnt";
import { UserRoleEnum } from '../model/userModels';
import { Review } from "./ReviewEnt";

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ 
        unique: true, 
        nullable: false
    })
        username: string;

    @Column({ 
        unique: true, 
        nullable: false 
    })
        email: string;

    @Column({ 
        unique: true,
        nullable: false
    })
        password: string;
    
    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.USER,
    })
    role: UserRoleEnum;

    @Column({
        nullable: false,
        default: 0
    })
    balance: number;

    @OneToOne(
        () => Cart,
        cart => cart.user,
    )
    cart: Cart

    @OneToOne(
        () => UserInfo,
        user_info => user_info.user
    )
    user_info: UserInfo;

    @OneToMany(
        () => Rating,
        rating => rating.user
    )
    rating: Rating[];

    @OneToMany(
        () => Review,
        review => review.item
    )   
    review: Review[];
}

export type UserType = InstanceType<typeof User>