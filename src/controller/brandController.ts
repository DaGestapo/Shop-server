import { Response, Request, NextFunction } from "express";

import ApiError from "../error/ApiError";
import dataSource from '../db';

import { Brand } from "../entity/BrandEnt";
import { TypeBrandI } from "../model/BrandAndTypeI";
import {brandTypeService} from "../services/BrandService";

class BrandController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {name}: TypeBrandI = req.body;
            if(!name) {
                return next(ApiError.badRequest('The brand name is missing!'));
            }
            const brand = await brandTypeService.findTableByName(Brand, name);
            if(brand) {
                return next(ApiError.badRequest('The brand already exists!'));
            }
    
            const brandCandidate = brandTypeService.createTableByName(Brand, name);

            return res.status(200).json(brandCandidate);
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }

    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const brands = await brandTypeService.findAllTableByTableType(Brand);
            res.status(200).json({brands});
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;
            if(!id) {
                next(ApiError.badRequest('Invalid id!'));
            }
            const brand = await brandTypeService.deleteArticleTableById(Brand, id);
            return res.status(200).json({brand});
        
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }
}

export default new BrandController();