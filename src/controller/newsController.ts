import { Response, Request, NextFunction } from "express";
import { NewsI } from "../model/postRequestI";
import ApiError from "../error/ApiError";
import dataSource from '../db';
import { News } from "../entity/NewsEnt";
import uuid = require('uuid');
import path from "path";
import articleService from "../services/articleService";
import { title } from "process";

class NewsController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data: NewsI = req.body;
            const filename = uuid.v4() + '.svg';

            const oldNews = await articleService.findOneArticleTableByTitle(News, title);
            if(oldNews) {
                next(ApiError.badRequest('An article with this title already exists!'));
            }
            if(req.files && !(req.files.img instanceof Array)) {
                const img = req.files.img;
                img.mv(path.resolve(__dirname, '..', 'static', 'svg', filename));
            }
            
            const newsArticle = await articleService.createActicleTable(News, {
                img: filename,
                title: data.title,
                description: data.description
            });

            return res.json({newsArticle});

        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            let {limit} = req.query;
            let take = Number(limit) || 3;
    
            if(!limit) {
                next(ApiError.badRequest('Incorrect login on news!'));
            }

            const newsArticle = await articleService.findAllTableByTableType(News, take);

            return res.json({newsArticle});

        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
       try {
            const {id} = req.params;
            if(!id) {
                next(ApiError.badRequest(`Id entered incorrectly!`));
            }
            const newsArticle = await articleService.deleteArticleTableById(News, id);
            return res.json({newsArticle});

       } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
       }
    }
}

export default new NewsController();