import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import dataSource from '../db';
import {Type} from '../entity/TypeEnt';
import { TypeBrandI } from "../model/BrandAndTypeI";
import { brandTypeService } from "../services/BrandService";

class TypeController {
    public async create(req: Request, res: Response, next: NextFunction) {
       try {
            const {name}: TypeBrandI = req.body;
            if(!name) {
                return next(ApiError.badRequest('No type name entered!'));
            }

            const type = await brandTypeService.findTableByName(Type, name);
            if(type) {
                return next(ApiError.badRequest('This type of product is already in the system!'));
            }
    
            const newType = await brandTypeService.createTableByName(Type, name);

            return res.status(200).json({newType});
       } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
       }

    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const types = await brandTypeService.findAllTableByTableType(Type);
            return res.status(200).json({types});

        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;
            if(!id) {
                return next(ApiError.badRequest('Invalid id!'));
            }
            
            await brandTypeService.deleteArticleTableById(Type, id);
            const types = brandTypeService.findAllTableByTableType(Type);

            return res.status(200).json({types});
        
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }
}

export default new TypeController();