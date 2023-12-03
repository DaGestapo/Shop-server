import dataSource from '../db';

import { EntityTarget } from "typeorm";

export class TableServices {

    public async createTableByTableTypeAndProps<T extends EntityTarget<any>>
    (Table: T, props: any) {
        const table = dataSource.manager.create(Table, props);

        return await dataSource.manager.save(table);
    }

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
        await dataSource.manager.delete(Table, {
            id
        });
    }

}

export const articleService =  new TableServices();