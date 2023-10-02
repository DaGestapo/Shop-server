import { Response, Request, NextFunction } from "express";
import { TypeBrandI } from "../model/postRequestI";
import ApiError from "../error/ApiError";
import dataSource from '../db';
import { Brand } from "../entity/BrandEnt";

class BrandController {
    public async create(req: Request, res: Response, next: NextFunction) {
        const data: TypeBrandI = req.body;
            if(!data.name) {
                next(ApiError.badRequest('Введите название бренда!'));
            }

            const brand = await dataSource.manager.findOneBy(Brand, {
                name: data.name
            });
            if(brand) {
                next(ApiError.badRequest('Данный тип уже представлен в системе'));
            }
    
            const typeCandidate = dataSource.manager.create(Brand, {
                name: data.name
            });
    
            await dataSource.manager.save(typeCandidate);

            res.status(200).json({typeCandidate});
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const brands = await dataSource.manager.find(Brand);
            res.status(200).json({brands})
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
            const brand = await dataSource.manager.delete(Brand, {
                id
            });
            res.status(200).json({brand});
        
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }
}

export default new BrandController();