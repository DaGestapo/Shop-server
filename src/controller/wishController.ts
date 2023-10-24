import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import wishService from "../services/wishService";
import itemService from "../services/itemService";


class WishController {
    public async create(req: Request, res: Response, next: NextFunction) {
       try {
            const {itemId, id} = req.body;

            if(!itemId) {
                next(ApiError.badRequest(`id товара не введен!`));
            }

            const item = await itemService.findOneTableById(itemId);
            const wishTable = await wishService.findUserWishTable(id);

            if(!item) {
                return next(ApiError.badRequest(`товар не найден!`));
            }
            if(!wishTable) {
                return next(ApiError.badRequest(`Список желаний не найден!`));
            }

            const wishItem = await wishService.cretateWishItemTable(item, wishTable);
            if(!wishItem) {
                return next(ApiError.badRequest(`Не удалось добавить товар в список желаймого!`));
            }

            return res.json(wishItem);


       } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
       }

    }

    public async getWish(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body;

            const wishItems = await wishService.findUserWishItems(id);

            return res.json(wishItems);

           
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }

    public async deleteWishItem(req: Request, res: Response, next: NextFunction) {
        try {
          const {wishItemId, id} = req.body;

          if(!wishItemId) {
            return next(ApiError.badRequest('Не введен id товара из списка желаемого!'));
          }
          
          const wishItem = await wishService.findWishItemByWishItemId(wishItemId, id);
          if(!wishItem) {
            return next(ApiError.badRequest('Желаемый товар не обнаружен!'));
          }

          await wishService.deleteWishItem(wishItem);

          const wishedItems = await wishService.findUserWishItems(id);
          return res.json(wishedItems);
            
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }
}

export default new WishController();