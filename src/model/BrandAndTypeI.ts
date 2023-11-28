import { Brand } from "../entity/BrandEnt";
import {Type} from '../entity/TypeEnt';

export interface TypeBrandI {
    name: string;
}


// ____________ Types

export type ProducteBrandAndTypeType = Brand | Type;