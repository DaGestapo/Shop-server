import { Response, Request, NextFunction } from "express";
import { NewsI } from "../model/postRequestI";
import ApiError from "../error/ApiError";
import dataSource from '../db';
import { News } from "../entity/NewsEnt";
import uuid = require('uuid');
import path from "path";

class NewsController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data: NewsI = req.body;
            const filename = uuid.v4() + '.svg';

            const oldNews = await dataSource.manager.findOneBy(News, {
                title: data.title 
            });
            if(oldNews) {
                next(ApiError.badRequest('Статья с таким название уже существует'));
            }
          
            if(req.files && !(req.files.img instanceof Array)) {
                const img = req.files.img;
                img.mv(path.resolve(__dirname, '..', 'static', filename));
            }
            
            const newsArticle = dataSource.manager.create(News, {
                img: filename,
                title: data.title,
                description: data.description
            });
            console.log(newsArticle);
            await dataSource.manager.save(newsArticle);

            return res.json({newsArticle});

        } catch (error) {
            next(ApiError.badRequest(`Неизвестная ошибка + ${error}`));
        }
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            let {limit} = req.query;
            let take = Number(limit) || 3;
    
            if(!take || !limit) {
                next(ApiError.badRequest('Неверный лимин на news'));
            }

            const newsArticle = await dataSource.manager.find(News, {
                take
            });

            return res.json({newsArticle});

        } catch (error) {
            next(ApiError.badRequest(`Неизвестная ошибка + ${error}`));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
       try {
        const {id} = req.params;
        if(!id) {
            next(ApiError.badRequest(`Неверно введен id`));
        }
        const newsArticle = await dataSource.manager.delete(News, {
            id
        })
        dataSource.manager.save(News);

        return res.json({newsArticle});

       } catch (error) {
        
       }
    }
}

export default new NewsController();