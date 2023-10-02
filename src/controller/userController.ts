import bcrypt from 'bcrypt';
import { Response, Request, NextFunction } from "express";
import { RegistrationI, LoginI } from '../model/postRequestI';
import ApiError from '../error/ApiError';
import {User} from '../entity/UserEnt';
import dataSource from '../db';
import generateJwtTokenUtil from '../utils/generateJwtTokenUtil';

import userService from '../services/userService';

class UserController {

    public async registration(req: Request, res: Response, next: NextFunction) {
        try {
            let {username, email, password, role} = req.body;

            if(!email) {
                next(ApiError.unauthorized('Неверно введен email!'));
            } else if(!password) {
                next(ApiError.unauthorized('Неверно введен пароль!'));
            } else if(!username) {
                next(ApiError.unauthorized('Введите ваше имя!'));
            }

            const candidate = await userService.checkCandidat(email);
            if(candidate) {
                next(ApiError.unauthorized('Пользователь с таким email уже существует!'));
            }

            const user = await userService.creteNewUser({
                id: '',
                username,
                email,
                password,
                role
            });
            if(!user) {
                next(ApiError.unauthorized('Произошла ошибка при регистрации!'));
            }

            await userService.createBasketTable(user);
            await userService.createUserInfoTable(user);

            const token = generateJwtTokenUtil(user.id, user.username ,user.email, user.role);
            res.status(200).json({token});

        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {username, email, password} = req.body;

            if(!email && !username) {
                return next(ApiError.unauthorized('Введите имя пользователя или email!'));
            } else if(!password) {
                return next(ApiError.unauthorized('Пароль не введен!'));
            }

            const user = email
                ? await userService.findUserTableByEmail(email)
                : await userService.findUserTableByUsername(username);
            if(!user) {
                return next(ApiError.badRequest('Такого пользователя не существует'));
            }

            const comparePassword = await bcrypt.compare(password, user.password);
            if(!comparePassword) {
                return next(ApiError.unauthorized('Неверный пароль!'));
            } else {
                const token = generateJwtTokenUtil(user.id, user.username ,user.email, user.role);
                res.status(200).json({token});
            }

            
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }

    public async auth(req: Request, res: Response, next: NextFunction) {
        try {
            const {id, username, email, role} = req.body;
            const token = generateJwtTokenUtil(id, username, email, role);
            res.status(200).json({token});
        
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }

    public async getBalance(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;
            if(!id) {
                return  next(ApiError.badRequest('Неверный id!'));
            }
            const user = await userService.findUserTableById(id);
            if(!user) {
                return  next(ApiError.badRequest('Пользователя не существует!'));
            }

            return res.json({balance: user.balance});
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }

    public async deleteAccount(req: Request, res: Response, next: NextFunction) {
        try {
            // Get id from token
            const {id} = req.body;
            if(!id) {
                return next(ApiError.badRequest('Неверный id!'));
            }
            const user = await userService.findUserTableById(id);

            if(!user) {
                return next(ApiError.badRequest('Не удалось найти пользователя!'));
            }

            const deleteResult = await userService.deleteUserTable(user);

            if(deleteResult) {
                res.json({message: 'Ваш аккаунт успешно удален!'}).status(200);
            } else {
                return next(ApiError.badRequest('Не удалось удалить ваш аккаунт!'));
            }
        
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }

}

export default new UserController();