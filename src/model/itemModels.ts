export interface ItemI {
    name: string | undefined;
    price: number | undefined;
    priceOff: number | undefined;
    saleOff: number | undefined;
    img: string | undefined;
    hot: boolean | undefined;
}

export interface ItemInfoI {
    descriptions: string | undefined;
    colors: string | undefined;
    available: boolean | undefined;
    sizes: string | undefined;
}

export interface ItemRelationTableI {
    rating: boolean;
    type: boolean;
    brand: boolean;
    review: boolean;
    item_imgs: boolean;
    item_info: boolean;
}