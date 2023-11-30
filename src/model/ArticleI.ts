import { Advantage } from "../entity/AdvantageEnt";
import { FeaturedItem } from "../entity/FeaturedProductEnt";
import { News } from "../entity/NewsEnt";

export interface TitleI {
    title: string;
}

export interface ArticleI extends TitleI{
    description: string;
}


export interface InfoI {
    descriptions: string;
    colors: string;
    available: boolean;
    sizes: string;
}

export interface ImgsI {
    src: string
}

// _____________________________ Current Entuty Interfaceses

export interface AdvantagesI extends ArticleI {
    img: string;
} 

export interface FeaturedItemI extends TitleI {
    price: string;
    priceOff?: string | null; 
    img: string;
}

export interface NewsI extends ArticleI {

}

// ______________________  Types

export type ArticleType = Advantage | FeaturedItem | News;
export type ArticlePropsType = AdvantagesI | FeaturedItemI | NewsI;