import { Response, Request, NextFunction } from "express";
import uuid = require('uuid');
import path = require("path");

import ApiError from "../error/ApiError";
import dataSource from '../db';

import articleService from '../services/articleService';

import { Advantage } from "../entity/AdvantageEnt";
import { ArticleI } from "../model/ArticleI";
import { LimitI, IdI} from "../model/requestI";

class AdvantageController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {title, description}: ArticleI = req.body;
            const files = req.files;
            const filename = uuid.v4() + '.svg';

            if(!files ) {
                return next(ApiError.badRequest('The image is missing!'));
            }
            if(!(files.img instanceof Array)) {
                files.img.mv(path.resolve(__dirname, '..', 'static', filename));
            } 
            if(!title || !description) {
                return next(ApiError.badRequest('There is no description and/or title of the article!'));
            }

            const article = await articleService.findOneArticleTableByTitle(Advantage, title);
            if(article) {
                return next(ApiError.badRequest('An article with this title already exists!'));
            }

            const articleCandidate = await articleService.createActicleTable(Advantage, {
                title,
                description,
                img: filename
            })

            return res.status(200).json({articleCandidate});
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
        
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            let {limit}: LimitI = req.query;
            let take: number = Number(limit) || 3;

            const articles = await articleService.findAllTableByTableType(Advantage, take);
            return res.status(200).json({articles})
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {id}: IdI = req.body;
            if(!id) {
                next(ApiError.badRequest('Invalid id!'));
            }
            const article = await articleService.deleteArticleTableById(Advantage, id);
            return res.status(200).json({article});
        
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }
}

export default new AdvantageController();