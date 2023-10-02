import { Response, Request, NextFunction } from "express";
import { AdvantageI } from "../model/postRequestI";
import ApiError from "../error/ApiError";
import dataSource from '../db';
import { Advantage } from "../entity/AdvantageEnt";
import uuid = require('uuid');
import path = require("path");

class AdvantageController {
    public async create(req: Request, res: Response, next: NextFunction) {
        const {title, description}: AdvantageI = req.body;
        const files = req.files;
        const filename = uuid.v4() + '.svg';
        if(!files ) {
            return next(ApiError.badRequest('Изображение не загружено!'));
        }
    
        if(!(files.img instanceof Array)) {
            const img = files.img;
            img.mv(path.resolve(__dirname, '..', 'static', filename));
        }
        
        if(!title || !description) {
            next(ApiError.badRequest('Введите описание и название статьи!'));
        }

        const article = await dataSource.manager.findOneBy(Advantage, {
            title
        });
        if(article) {
            next(ApiError.badRequest('Статья с таким название уже существует!'));
        }

        const articleCandidate = dataSource.manager.create(Advantage, {
            title,
            description,
            img: filename
        });

        await dataSource.manager.save(articleCandidate);

        res.status(200).json({articleCandidate});
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            let {limit} = req.query;
            let take = Number(limit) || 3;

            const articles = await dataSource.manager.find(Advantage, {
                take
            });
            res.status(200).json({articles})
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
            const article = await dataSource.manager.delete(Advantage, {
                id
            });
            await dataSource.manager.save(article);
            res.status(200).json({article});
        
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }
}

export default new AdvantageController();