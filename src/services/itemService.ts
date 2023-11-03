import { Between, DataSource } from "typeorm";
import { UploadedFile } from "express-fileupload";
import uuid = require('uuid');
import dataSource from '../db';
import path from "path";

import { Item } from "../entity/ItemEnt";
import { Type } from "../entity/TypeEnt";
import { Brand } from "../entity/BrandEnt";
import { ItemInfo } from "../entity/ItemInfoEnt";
import { ItemImgs } from "../entity/ItemImgsEnt";

import { ItemI, ItemInfoI, ItemRelationTableI } from "../model/itemModels";
import { hash } from "bcrypt";


class ItemService {
    private relations: ItemRelationTableI;

    constructor() {
        this.relations = {
            rating: true,
            type: true,
            brand: true,
            review: {
                user: {
                    user_info: true,
                    rating: {
                        item: true
                    }
                }
            },
            item_imgs: true,
            item_info: true,
        }
    }


    public async getItemByTypeBrand(
        skip: number, 
        take: number, 
        brandId: number | null, 
        typeId: number | null
    ) {
        const relations = this.relations;

        if(!brandId && !typeId) { 
            return await Item.find({
                relations,
                skip, 
                take
            });
        } else if(brandId && !typeId ) {
            return await Item.find({
                relations,
                where: {
                    brand: {
                    id: brandId
                }
            },
                skip,
                take
            });
        } else if(!brandId && typeId) {
            return await Item.find({
                where: {
                    type: {
                        id: typeId
                    }
                },
                relations,
                skip, 
                take,
            });
        } else if(typeId && brandId) {
            return await Item.find({
                relations,
                where: {
                    type: {
                        id: typeId
                    },
                    brand: {
                        id: brandId
                    }
                },
                skip,
                take
            })
        }
    }

    public async getItemByPriceRange(
        skip: number, 
        take: number, 
        lowPrice: number, 
        topPrice: number,
        brandId: number | null,
        typeId: number | null
    ) {
        const relations = this.relations;
        const price = Between(lowPrice, topPrice);

        if(!brandId && !typeId) { 
            return await Item.find({
                relations,
                skip, 
                take,
                where: {
                    price
                }
            });
        } else if(brandId && !typeId ) {
            return await Item.find({
                relations,
                where: {
                    brand: {
                        id: brandId
                    },
                    price
                },
                skip,
                take
            });
        } else if(!brandId && typeId) {
            return await Item.find({
                where: {
                    type: {
                        id: typeId
                    },
                    price
                },
                relations,
                skip, 
                take,
            });
        } else if(typeId && brandId) {
            return await Item.find({
                relations,
                where: {
                    type: {
                        id: typeId
                    },
                    brand: {
                        id: brandId
                    },
                    price
                },
                skip,
                take
            })
        }
    }

    public async findTableByType(typeId: number) {
        return await dataSource.manager.findOneBy(Type, {
            id: typeId
        });
    }

    public async findTableByBrand(brandId: number) {
        return await dataSource.manager.findOneBy(Brand, {
            id: brandId
        });
    }

    public async findOneTableById(tableId: string) {
        const relations = this.relations;

        return await dataSource.manager.findOne(Item, {
            where: {
                id: tableId
            },
            relations
        });
        
    }

    public async findHotItems(skip: number, take: number) {
        const relations = this.relations;
        
        return await dataSource.manager.find(Item, {
            relations,
            where: {
                hot: true
            }, 
            skip,
            take
        })
    }

    public async createItemTable(itemProp: ItemI) {
        const item = dataSource.manager.create(Item, itemProp);
        if(item) {
            await dataSource.manager.save(item);
        }
        return item;
    }

    public async creteInfoTable(info: ItemInfoI) {
        const infoSave = dataSource.manager.create(ItemInfo, info);
        if(infoSave) {
            dataSource.manager.save(infoSave);
        }

    }

    public async creteImgsTable(imgs: UploadedFile[] | UploadedFile, item: ItemI) {
        const filenames: string[] = [];

        if(imgs instanceof Array) {
            imgs.forEach(img => {
                filenames.push(uuid.v4() + '.svg'); 
                img.mv(path.resolve(__dirname, '..', 'static', filenames[filenames.length-1]));
            });
        } else {
            filenames.push(uuid.v4() + '.svg'); 
            imgs.mv(path.resolve(__dirname, '..', 'static', filenames[0]));
        }

        const imgsSave = dataSource.manager.create(ItemImgs, {
            item,
            img: JSON.stringify(filenames)
        });
        if(imgsSave) {
            await dataSource.manager.save(imgsSave);
        }
        return filenames;
    }

    public async findItemInfoTable(id: string) {
         return await dataSource.manager.findOne(ItemInfo, {
            where: {
                item: {
                    id
                }
            }
        })
    }
}


export default new ItemService();