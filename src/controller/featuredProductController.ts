import { Response, Request, NextFunction } from "express";
import uuid = require('uuid');
import path = require("path");

import ApiError from "../error/ApiError";
import dataSource from '../db';
import articleService from "../services/articleService";

import { FeaturedItem } from "../entity/FeaturedProductEnt";
import { FeaturedItemI } from "../model/ArticleI";


class FeaturedProductController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            let {title, price, priceOff}: FeaturedItemI = req.body;
            const filename = uuid.v4() + '.svg';
            const files = req.files;
            priceOff = priceOff || null;

            if(!files) {
                return next(ApiError.badRequest('No image found!'));
            }

            if(!(files.img instanceof Array)) {
                files.img.mv(path.resolve(__dirname, '..', 'static', filename));
            }
            if(!title || !price) {
                return next(ApiError.badRequest('The name of the product or/and its price is not found!'));
            }

            const feturedItemCandidat = await articleService.findOneArticleTableByTitle(FeaturedItem, title);
            if(feturedItemCandidat) {
                return next(ApiError.badRequest('This article about the product already exists!'));
            }
            let featuredItem;
            if(priceOff) {
                featuredItem = await articleService.createActicleTable(FeaturedItem, {
                    title,
                    price,
                    priceOff,
                    img: filename,
                });
            } else {
                featuredItem = await articleService.createActicleTable(FeaturedItem, {
                    title,
                    price,
                    img: filename,
                });
            }
            return res.json({item: featuredItem})
           
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
       try {
            let {limit} = req.query;
            const take = Number(limit) || 3;
            const articles = await articleService.findAllTableByTableType(FeaturedItem, take);

            return res.json({articles});
       } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
       }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {featuredItemId} = req.body;

            if(!featuredItemId) {
                return next(ApiError.badRequest('Invalid id!'));
            }

            const article = await articleService.deleteArticleTableById(FeaturedItem, featuredItemId);

            return res.json({article});
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }
}

export default new FeaturedProductController();