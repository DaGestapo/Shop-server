import { UserIdI } from "./UserI"

export interface CartI extends UserIdI{
    itemId: string;
    color: string;
    size: string;
    quantity?: string | number;
}
