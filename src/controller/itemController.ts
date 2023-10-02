import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import uuid = require('uuid');

import path from "path";
import itemService from "../services/itemService";
import { ItemInfoI } from "../model/itemModels";


class ItemController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            let {name, price, typeId, brandId, info, hot, priceOff} = req.body;

            if(!req.files ) {
                return next(ApiError.badRequest('Отсутствует файл!'));
            } else if(!name) {
                return next(ApiError.badRequest('Невеное название товара!'));
            } else if (!brandId || !typeId) {
                return next(ApiError.badRequest('Невеное название типа или бренда товара!'));
            } else if (!info) {
                return next(ApiError.badRequest('Информация о товаре не указана!'));
            } 

            const parseInfo: ItemInfoI = JSON.parse(info);

            let saleOff: number | undefined = undefined;
            let parseHot: boolean = false;
            price = Number(price);
            typeId = Number(typeId);
            brandId = Number(brandId); 

            if(priceOff) {
                priceOff = Number(priceOff);
                saleOff = price/priceOff * 100;
            }
            if(hot) {
                parseHot = JSON.parse(hot);
            }

            const type = await itemService.findTableByType(typeId);
            const brand = await itemService.findTableByBrand(brandId);
            if(!type || !brand) {
                return next(ApiError.badRequest('Данного типа или бренда не существует!'));
            }

            const filename = uuid.v4() + '.svg';
            if(!(req.files.img instanceof Array)) {
                const img = req.files.img;
                img.mv(path.resolve(__dirname, '..', 'static', filename));
            }

            const item = await itemService.createItemTable({
                name,
                price,
                priceOff,
                saleOff,
                img: filename,
                hot: parseHot                
            })
            await itemService.creteInfoTable(parseInfo);
            await itemService.creteImgsTable(req.files.imgs, item);

            return res.json({item});
        } catch (error) {
            next(ApiError.badRequest('Неизвестная ошибка' + error));
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            let {brandId, typeId, limit, page, leftPrice, rightPrice} = req.query;

            let take = Number(limit) || 8;
            let pageNum = Number(page) || 1;
            let skip = pageNum * take - take;

            let typeNumberId = Number(typeId) || null;
            let brandNumberId = Number(brandId) || null;
            let leftPriceNumber = Number(leftPrice) || null;
            let rightPriceNumber = Number(rightPrice) || null;

            let items; 
            if(leftPriceNumber && rightPriceNumber) {
                items = await itemService.getItemByPriceRange(
                    leftPriceNumber, 
                    rightPriceNumber, 
                    skip,
                    take,
                    brandNumberId,
                    typeNumberId
                );
            } else {
                items = await itemService.getItemByTypeBrand(
                    skip, 
                    take, 
                    brandNumberId, 
                    typeNumberId
                );
            }
           
            return res.json(items)
        } catch (error) {
            next(ApiError.badRequest('Неизвестная ошибка' + error));
        }


    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            if(!id) {
                next(ApiError.badRequest('Введите id товара!'));
            }
            const item = await itemService.findOneTableById(id);
 
            if(!item) {
                next(ApiError.badRequest('Товара под таким id не существует!'));
            }
            return res.json({item});
        } catch (error) {
            next(ApiError.badRequest('Неизвестная ошибка' + error));
        }
    }
        
}

export default new ItemController();