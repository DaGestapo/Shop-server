import { Response, Request, NextFunction } from "express";
import { FeaturedItemI } from "../model/postRequestI";
import ApiError from "../error/ApiError";
import dataSource from '../db';
import { FeaturedItem } from "../entity/FeaturedProductEnt";
import uuid = require('uuid');
import path = require("path");

class FeaturedProductController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            let {title, price, priceOff}: FeaturedItemI = req.body;
            const filename = uuid.v4() + '.svg';
            const files = req.files;
            priceOff = priceOff || null;

            if(!files) {
                return next(ApiError.badRequest('Изображение не загружено!'));
            }

            if(!(files.img instanceof Array)) {
                files.img.mv(path.resolve(__dirname, '..', 'static', filename));
            }

            if(!title || !price) {
                return next(ApiError.badRequest('Название продукта или/и его цена не введена!'));
            }

            const feturedItemCandidat = await dataSource.manager.findOneBy(FeaturedItem, {
                title
            });
            if(feturedItemCandidat) {
                return next(ApiError.badRequest('Данная статья о продукте уже существует!'));
            }
            let featuredItem: FeaturedItem;
            if(priceOff) {
                featuredItem = dataSource.manager.create(FeaturedItem, {
                    title,
                    price,
                    priceOff,
                    img: filename,
                });
            } else {
                featuredItem = dataSource.manager.create(FeaturedItem, {
                    title,
                    price,
                    img: filename,
                });
            }
            await dataSource.manager.save(featuredItem);
            return res.json({item: featuredItem})
           
        } catch (error) {
            next(ApiError.badRequest(`Неизвестная ошибка + ${error}`));
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
       let {limit} = req.query;
       const take = Number(limit) || 3;

       try {
            let {limit} = req.query;
            const take = Number(limit) || 3;

            const articles = await dataSource.manager.find(FeaturedItem, {
                take
            });

            return res.json({articles});
       } catch (error) {
            next(ApiError.badRequest(`Неизвестная ошибка + ${error}`));
       }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;

            if(!id) {
                return next(ApiError.badRequest('Неверный id!'));
            }

            const article = await dataSource.manager.delete(FeaturedItem, id);
            dataSource.manager.save(article);

            return res.json({article});
        } catch (error) {
            next(ApiError.badRequest(`Неизвестная ошибка + ${error}`));
        }
    }
}

export default new FeaturedProductController();