import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import uuid = require('uuid');

import { Item } from "../entity/ItemEnt";

import path from "path";
import itemService from "../services/itemService";
import { ItemInfoI } from "../model/itemModels";


class ItemController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            let {name, price, typeId, brandId, info, hot, priceOff} = req.body;

            if(!req.files ) {
                return next(ApiError.badRequest('Images is missing!'));
            } else if(!name) {
                return next(ApiError.badRequest('Incorrect product name!'));
            } else if (!brandId || !typeId) {
                return next(ApiError.badRequest('Incorrect product type or brand name!'));
            } else if (!info) {
                return next(ApiError.badRequest('Product information is not specified!'));
            } 
            
            const parseInfo: ItemInfoI = JSON.parse(info);
    
            let saleOff: number | undefined = undefined;
            let parseHot: boolean = false;
            price = Number(price);
            typeId = Number(typeId);
            brandId = Number(brandId); 
    
            if(priceOff) {
                priceOff = Number(priceOff);
                saleOff = Math.round(price/priceOff * 100);
            }
            if(hot) {
                parseHot = JSON.parse(hot);
            }
           
            const type = await itemService.findTableByType(typeId);
            const brand = await itemService.findTableByBrand(brandId);
            if(!type || !brand) {
                return next(ApiError.badRequest('This type or brand does not exist!'));
            }
            
            const filename = uuid.v4() + '.svg';
            if(!(req.files.img instanceof Array)) {
                const img = req.files.img;
                img.mv(path.resolve(__dirname, '..', 'static', filename));
            }
    
            const item = await itemService.createTableByTableTypeAndProps(Item, {
                name,
                price,
                priceOff,
                saleOff,
                img: filename,
                hot: parseHot,
                brand,
                type                
            });
            
            await itemService.creteInfoTable(parseInfo, item);
            await itemService.creteImgsTable(req.files.imgs, item);

            return res.json({item});
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            let {brandId, typeId, limit, hot, page, leftPrice, rightPrice} = req.query;

            let take = Number(limit) || 8;
            let pageNum = Number(page) || 1;
            let skip = pageNum * take - take;

            let typeNumberId = Number(typeId) || null;
            let brandNumberId = Number(brandId) || null;
            let leftPriceNumber = Number(leftPrice) || null;
            let rightPriceNumber = Number(rightPrice) || null;
     
            let items: Item[] | null = null;
            if(leftPriceNumber && rightPriceNumber) {

                items = await itemService.getItemByPriceRange(
                    leftPriceNumber, 
                    rightPriceNumber, 
                    skip,
                    take,
                    brandNumberId,
                    typeNumberId
                );
            } else if(hot) {
               items = await itemService.findHotItems(skip, take);
            } else {
                items = await itemService.getItemByTypeBrand(
                    skip, 
                    take, 
                    brandNumberId, 
                    typeNumberId
                );
            }
            if(!items) {
                return res.json(items);;
            }

            let response = [];
            for(let item of items) {
                let tempReviewArr = [];

                for(let i = 0; i < item.review.length; i++) {
                    let review = item.review[i];
                    let user = item.review[i].user;

                    for(let j = 0; j < user.rating.length; j++) {
                        if(user.rating[j].item.id === item.id) {
                            const tempObj = {
                                id: review.id,
                                review: review.review,
                                user: {
                                    id: user.id,
                                    username: user.username,
                                    email: user.email,
                                    img: user.user_info.img
                                },
                                rating: {
                                    id: user.rating[j].id,
                                    rate: user.rating[j].rate
                                }
                            }
                            tempReviewArr.push(tempObj);
                        }
                    }
                }
                response.push({...item, review: tempReviewArr});
            }

            return res.json(response);
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }


    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            if(!id) {
                next(ApiError.badRequest('Invalid Id!'));
            }
            const item = await itemService.findOneTableById(id);

            if(!item) {
                return next(ApiError.badRequest('There is no product with this id!'));
            }
            // TODO FOR GETALL
            let tempReviewArr = [];
            for(let i = 0; i < item.review.length; i++) {
                let review = item.review[i];
                let user = item.review[i].user;

                for(let j = 0; j < user.rating.length; j++) {
                    if(user.rating[j].item.id === id) {
                        const tempObj = {
                            id: review.id,
                            review: review.review,
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                img: user.user_info.img
                            },
                            rating: {
                                id: user.rating[j].id,
                                rate: user.rating[j].rate
                            }
                        }
                        tempReviewArr.push(tempObj);
                    }
                }
            }

            return res.json({... item, review: tempReviewArr});

        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async getItemInformation(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
    
            const itemInfo = await itemService.findItemInfoTable(id);
            if(!itemInfo) {
                next(ApiError.badRequest('The table with information about the subject was not found!'));
            }

            res.json(itemInfo);
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }
        
}

export default new ItemController();