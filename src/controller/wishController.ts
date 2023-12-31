import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import wishService from "../services/wishService";
import itemService from "../services/itemService";
import cartService from "../services/cartService";


class WishController {
    public async create(req: Request, res: Response, next: NextFunction) {
       try {
            const {itemId, id} = req.body;

            if(!itemId) {
                return next(ApiError.badRequest(`the product ID is not entered!`));
            }

            const item = await itemService.findOneTableById(itemId);
            const wishTable = await wishService.findUserWishTable(id);

            if(!item) {
                return next(ApiError.badRequest(`The product was not found!`));
            }
            if(!wishTable) {
                return next(ApiError.badRequest(`Wish list not found!`));
            }

            const wishItem = await wishService.findWishItemByItemIdAndUserId(itemId, id);
            if(wishItem) {
                return next(ApiError.badRequest(`This product is already on the wish list!`));
            }

            
            const cartItem = await cartService.findCartItemByUserIdAndItemId(itemId, id);
            if(cartItem) {
                return next(ApiError.badRequest(`This product is already in the cart!`));
            }

            const wishCandidat = await wishService.cretateWishItemTable(item, wishTable);
            if(!wishCandidat) {
                return next(ApiError.badRequest(`Could not add the product to the wish list!`));
            }

            return res.json({message: `The item has been added to the wish list!`});
       } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
       }

    }

    public async getWish(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;
            const wishItems = await wishService.findUserWishItems(id);

            return res.json(wishItems);
           
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async deleteWishItem(req: Request, res: Response, next: NextFunction) {
        try {
          const {wishItemId, id} = req.body;

          if(!wishItemId) {
            return next(ApiError.badRequest('The product ID from the desired list has not been entered!'));
          }
          
          const wishItem = await wishService.findWishItemByWishItemId(wishItemId, id);
          if(!wishItem) {
            return next(ApiError.badRequest('The desired product has not been detected!'));
          }

          await wishService.deleteWishItem(wishItem);

          const wishedItems = await wishService.findUserWishItems(id);
          return res.json(wishedItems);
            
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }
}

export default new WishController();