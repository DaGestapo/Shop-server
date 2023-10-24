import { User } from "../entity/UserEnt";
import dataSource from '../db';
import bcrypt from 'bcrypt';
import { UserType } from "../entity/UserEnt";
import { UserRoleEnum } from '../model/userModels';
import { Cart } from "../entity/CartEnt";
import { UserInfo } from "../entity/UserInfoEnt";
import { Wish } from "../entity/WishEnt";

import generateJwtTokenUtil from '../utils/generateJwtTokenUtil';

import { UserI } from "../model/userModels";


class UserService {

    public async checkCandidat(email: string) {
        return await dataSource.manager.findOneBy(User, {
            email
        });
    }

    public async creteNewUser(userProps: UserI) {
        const passwordCript: string = await bcrypt.hash(userProps.password, 4); 
        let role: UserRoleEnum = UserRoleEnum.USER;

        if(userProps.role === UserRoleEnum.ADMIN) {
            role = UserRoleEnum.ADMIN;
        } 
        const user = dataSource.manager.create(User, {
            username: userProps.username,
            email: userProps.email,
            password: passwordCript,
            role
        });

        await dataSource.manager.save(user);
        
        return user;
    }

    public async createUserInfoTable( user: User) {
        const userInfo = dataSource.manager.create( UserInfo, {
            user,
            username: user.username,
            
        });
        await dataSource.manager.save(userInfo);
    }

    public async findUserTableByEmail(email: string) {
       return await dataSource.manager.findOneBy(User, {
            email
        });
    }

    public async findUserTableByUsername(username: string) {
        return await dataSource.manager.findOneBy(User, {
            username
         });
     }

     public async findUserTableById(id: string) {
        return await dataSource.manager.findOneBy(User, {
            id
         });
     }

     public async deleteUserTable(user: User) {
       const deleteResult = await dataSource.manager.delete(User, user);

        if(deleteResult) {
            return true;
        } 
        return false;
     }

}

export default new UserService();