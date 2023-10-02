import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import dataSource from '../db';
import {Type} from '../entity/TypeEnt';
import { TypeBrandI } from "../model/postRequestI";

class TypeController {
    public async create(req: Request, res: Response, next: NextFunction) {
       try {
            const data: TypeBrandI = req.body;
            if(!data.name) {
                next(ApiError.badRequest('Введите название бренда!'));
            }

            const type = await dataSource.manager.findOneBy(Type, {
                name: data.name
            });
            if(type) {
                next(ApiError.badRequest('Данный тип уже представлен в системе'));
            }
    
            const typeCandidate = dataSource.manager.create(Type, {
                name: data.name
            });
    
            await dataSource.manager.save(typeCandidate);

            res.status(200).json({typeCandidate});
       } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
       }

    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const types = await dataSource.manager.find(Type);
            res.status(200).json({types})
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;
            if(!id) {
                next(ApiError.badRequest('Неверный id!'));
            }
            const type = await dataSource.manager.delete(Type, {
                id
            });
            res.status(200).json({type});
        
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }
}

export default new TypeController();