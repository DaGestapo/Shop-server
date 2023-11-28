import dataSource from '../db';

import { EntityTarget } from "typeorm";

export class TableServices {

    public async findAllTableByTableType<T extends EntityTarget<any>>
    (Table: T, take?: number) {
        return await dataSource.manager.find(Table, {
            take
        });
    }

    public async findTableByTableIdAndTableType<T extends EntityTarget<any>>
    (Table: T, id: string | number) {
        return await dataSource.manager.findOneBy(Table, {
            id
        });
    }

    public async deleteArticleTableById<T extends EntityTarget<any>>
    (Table: T, id: string | number) {
        const article = await dataSource.manager.delete(Table, {
            id
        });

        await dataSource.manager.save(article);
    }

}

export const articleService =  new TableServices();