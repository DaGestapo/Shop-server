import { Item } from "../entity/ItemEnt";

export interface ItemI {
    name: string | undefined;
    price: number | undefined;
    priceOff: number | undefined;
    saleOff: number | undefined;
    img: string | undefined;
    hot: boolean | undefined;
}

export interface ItemInfoI {
    description: string | undefined;
    colors: string | undefined;
    available: boolean | undefined;
    sizes: string | undefined;
}

export interface ItemRelationTableI {
    rating: boolean;
    type: boolean;
    brand: boolean;
    review: {
        user: {
            user_info: true,
            rating: {
                item: true
            }
        }
    };
    item_imgs: boolean;
    item_info: boolean;
}