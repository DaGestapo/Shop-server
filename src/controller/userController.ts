import bcrypt from 'bcrypt';
import { Response, Request, NextFunction } from "express";
import ApiError from '../error/ApiError';
import generateJwtTokenUtil from '../utils/generateJwtTokenUtil';

import userService from '../services/userService';
import cartService from '../services/cartService';
import wishService from '../services/wishService';


class UserController {
    private regExpEmail: RegExp;

    constructor() {
        this.regExpEmail = new RegExp(`[a-z0-9!#$%&'*+/=?^_'{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_'{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`);
    }

    public async registration(req: Request, res: Response, next: NextFunction) {
        try {
            let {username, email, password, passwordAgain, role} = req.body;
            const compareWithRegExp = this.regExpEmail.test(email);

            if(!email) {
                return next(ApiError.unauthorized('The email was entered incorrectly!'));
            } else if(!password) {
                return next(ApiError.unauthorized('The password was entered incorrectly!'));
            } else if(!username) {
                return next(ApiError.unauthorized('Enter your name!'));
            } else if(!compareWithRegExp) {
                return next(ApiError.badRequest(`Its not a email expresion!`));
            } else if(passwordAgain !== password) {
                return next(ApiError.badRequest(`The repeated password was entered incorrectly!`));
            }

            const candidate = await userService.checkCandidat(email);
            if(candidate) {
                return next(ApiError.unauthorized('A user with this email already exists!'));
            }

            const user = await userService.creteNewUser({
                id: '',
                username,
                email,
                password,
                role
            });
            if(!user) {
                return next(ApiError.unauthorized('An error occurred during registration!'));
            }

            await wishService.createWhishTable(user);
            await cartService.createCartTable(user);
            await userService.createUserInfoTable(user);

            const token = generateJwtTokenUtil(user.id, user.username ,user.email, user.role);
            return res.status(200).json({token});

        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {username, email, password} = req.body;
            const compareWithRegExp = this.regExpEmail.test(email);
            
            if(!email && !username) {
                return next(ApiError.unauthorized('Username or email is not entered!'));
            } else if(!password) {
                return next(ApiError.unauthorized('The password is not entered!'));
            } else if(!compareWithRegExp) {
                return next(ApiError.unauthorized(`It's not a email expresion!`));
            }

            const user = email
                ? await userService.findUserTableByEmail(email)
                : await userService.findUserTableByUsername(username);
            
            if(!user) {
                return next(ApiError.badRequest('There is no such user!'));
            }

            const comparePassword = await bcrypt.compare(password, user.password);
            if(!comparePassword) {
                return next(ApiError.unauthorized('Неверный пароль!'));
            } else {
                const token = generateJwtTokenUtil(user.id, user.username ,user.email, user.role);
                return res.status(200).json({token});
            }

        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async auth(req: Request, res: Response, next: NextFunction) {
        try {
            const {id, username, email, role} = req.body;
            const token = generateJwtTokenUtil(id, username, email, role);
            res.status(200).json({token});
        
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async getBalance(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;
            if(!id) {
                return  next(ApiError.badRequest('Invalid id!'));
            }
            const user = await userService.findUserTableById(id);
            if(!user) {
                return  next(ApiError.badRequest('The user does not exist!'));
            }

            return res.json(user.balance);
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async deleteAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;
            if(!id) {
                return next(ApiError.badRequest('Invalid id!'));
            }
            const user = await userService.findUserTableById(id);
            if(!user) {
                return next(ApiError.badRequest(`Couldn't find the user!`));
            }

            const deleteResult = await userService.deleteUserTable(user);
            if(deleteResult) {
                return res.json({message: 'Your account has been successfully deleted!'}).status(200);
            } else {
                return next(ApiError.badRequest(`Couldn't delete your account!`));
            }
        
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

}

export default new UserController();