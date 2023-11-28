import { ParsedUrlQuery } from "querystring" 

export interface LimitI {
    limit?: string;
}

export interface RequestI extends LimitI {
    page?: string;
}

export interface ItemRequestI extends RequestI {
    brandId?: string;
    typeId?: string;
    hot?: string;
    leftPrice?: string;
    rightPrice?: string;
}

// _____________________________________

export interface IdI {
    id: string | number;
}