import dataSource from '../db';
import { TableServices } from './TableServices';
import { EntityTarget } from 'typeorm';

import { ProducteBrandAndTypeType } from '../model/BrandAndTypeI';

class BrandTypeService extends TableServices {

    public async createTableByName<T extends EntityTarget<ProducteBrandAndTypeType>>
    (Table: T, name: string) {
        const candidat = dataSource.manager.create(Table, {
            name
        });

        await dataSource.manager.save(candidat);
    }

    public async findTableByName<T extends EntityTarget<ProducteBrandAndTypeType>>
    (Table: T, name: string) {
        return await dataSource.manager.findOneBy(Table, {
            name
        });
    }
    
}

export const brandTypeService = new BrandTypeService();