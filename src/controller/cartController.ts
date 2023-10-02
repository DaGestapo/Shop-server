import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import dataSource from '../db';
import { Review } from "../entity/ReviewEnt";
import { Item } from "../entity/ItemEnt";
import { User } from "../entity/UserEnt";
import reviewService from "../services/reviewService";
import userService from "../services/userService";
import itemService from "../services/itemService";
import { CartItem } from "../entity/CartItemEnt";
import { CartItemInformation } from "../entity/CartItemInformationEnt";
import cartService from "../services/cartService";
import { Cart } from "../entity/CartEnt";


class CartController {
    public async create(req: Request, res: Response, next: NextFunction) {
       try {
          const {color, size, itemId, id, quantity} = req.body;

          const quantityNumber = Number(quantity);
          if(!color || !size) {
            return next(ApiError.badRequest('Не выбран цвет или размер!'));
          }
          if(!itemId) {
            return next(ApiError.badRequest('Не указан id товара!'));
          }

          const cartItemCandidat = await cartService.findCartItemByItemId(itemId);
          if(cartItemCandidat) {
            return next(ApiError.badRequest('Вы уже добавили данный товар в корзину!'));
          }

          const item = await itemService.findOneTableById(itemId);
          if(!item) {
            return next(ApiError.badRequest('Данного товара не существует!'));
          }

          const userCart = await cartService.findUserCart(id);
          if(!userCart) {
            return next(ApiError.badRequest('У пользователя нет корзины!'));
          }

          const cartItem = await cartService.cretateCartItemTable(item, userCart);
          const cartItemInfo = await cartService.cretateCartItemInformationTable(cartItem, color, size, quantityNumber);

          return res.json({cartItem});


       } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
       }

    }

    public async getCart(req: Request, res: Response, next: NextFunction) {
        try {
          const {id} = req.body;

          const cart = await cartService.findUserCart(id);
          if(!cart) {
            return next(ApiError.badRequest('Корзина не найдена!'));
          }

          return res.json(cart);

           
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }

    public async changeQuantity(req: Request, res: Response, next: NextFunction) {
      try {
        const {quantity, cartedItemId, id} = req.body;
        const quantityNumber = Number(quantity) || null;
        if(!quantityNumber) {
          return next(ApiError.badRequest(`Количество не задано!`));
        }

        if(quantityNumber < 1 || quantityNumber > 10) {
          return next(ApiError.badRequest(`Неподходящее количество товаров!`));
        }


        const cartedItemInformation = await cartService.findCartedItemInformationTableByCartedItemIdAndUserId(cartedItemId, id);
        if(!cartedItemInformation) {
          return next(ApiError.badRequest(`Корзина не обнаружена!`));
        }

        await cartService.updateQuantityOfCartedItem(quantityNumber, cartedItemInformation);
        return res.json(quantityNumber);

      } catch (error) {
        return next(ApiError.badRequest(`Неизвестная ошибка!`));
      }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
          const {cartedItemId, id} = req.body;
          console.log(req.body);
          if(!cartedItemId) {
            return next(ApiError.badRequest('Не введун id предмета в корзине!'));
          }

          const carttedItem = await cartService.findCartItemByItemId(cartedItemId);
          if(!carttedItem) {
            return next(ApiError.badRequest('Предмет не обнаружен в вашей корзине!'));
          }
          const deleteResult = await cartService.deleteCartedItem(carttedItem);

          const cart = await cartService.findUserCart(id);
          if(!cart) {
            return next(ApiError.badRequest('Корзина не найдена!'));
          }

          return res.json(cart);
            
        } catch (error) {
            next(ApiError.badRequest('Непредвиденная ошибка - ' + error));
        }
    }
}

export default new CartController();