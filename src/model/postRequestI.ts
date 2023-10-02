import { UserRoleEnum } from "./userModels";

export interface RegistrationI {
    username: string;
    email: string;
    password: string;
    role?: UserRoleEnum;
}

export interface LoginI {
    username?: string;
    email?: string;
    password: string;
}

export interface TypeBrandI {
    name: string;
}

export interface AdvantageI {
    title: string;
    description: string;
}

export interface FeaturedItemI {
    title: string;
    price: string;
    priceOff: string | null; 
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

export interface NewsI {
    title: string;
    description: string;
}