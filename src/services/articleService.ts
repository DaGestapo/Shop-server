import dataSource from '../db';

import { EntityTarget } from "typeorm";
import {ArticleType, ArticlePropsType} from '../model/ArticleI';
import {TableServices} from './TableServices';

class ArticleService extends TableServices{

    public async createActicleTable<T extends EntityTarget<ArticleType>>
    (Article: T, props: ArticlePropsType): 
        Promise<ArticlePropsType> {
        const article = dataSource.manager.create( Article, props);
        return await dataSource.manager.save(article);
    }

    public async findOneArticleTableByTitle<T extends EntityTarget<ArticleType>>
    (Article: T, title: string) {
        return await dataSource.manager.findOneBy(Article, {
            title
        });
    }
}

export default new ArticleService();