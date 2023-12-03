import { Response, Request, NextFunction } from "express";
import ApiError from "../error/ApiError";
import itemService from "../services/itemService";
import cartService from "../services/cartService";

import { Item } from "../entity/ItemEnt";

import { CartI } from "../model/CartI";
import { CartItem } from "../entity/CartItemEnt";
import { UserIdI } from "../model/UserI";


class CartController {
    public async create(req: Request, res: Response, next: NextFunction) {
       try {
          const {color, size, itemId, id, quantity}: CartI = req.body;

          const quantityNumber = Number(quantity);
          if(!color || !size) {
            return next(ApiError.badRequest('No color or size selected!'));
          }
          if(!itemId) {
            return next(ApiError.badRequest('The product ID is not specified!'));
          }

          const cartItemCandidat = await cartService.findCartItemByItemId(itemId);
          if(cartItemCandidat) {
            return next(ApiError.badRequest('You have already added this product to the cart!'));
          }

          const item = await itemService.findTableByTableIdAndTableType(Item, itemId)
          if(!item) {
            return next(ApiError.badRequest('This product does not exist!'));
          }

          const userCart = await cartService.findUserCart(id);
          if(!userCart) {
            return next(ApiError.badRequest('The user does not have a shopping cart!'));
          }

          const cartItem = await cartService.cretateCartItemTable(item, userCart);
          const cartItemInfo = await cartService.cretateCartItemInformationTable(cartItem, color, size, quantityNumber);
          console.log(cartItem);
          return res.json(cartItem);


       } catch (error) {
          next(ApiError.badRequest(`Unexpected error - ${error}!`));
       }

    }

    public async getCart(req: Request, res: Response, next: NextFunction) {
        try {
          const {id}: UserIdI = req.body;

          const cart = await cartService.findUserCart(id);
          if(!cart) {
            return next(ApiError.badRequest('The basket was not found!'));
          }
       
          return res.json(cart);
           
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }

    public async changeQuantity(req: Request, res: Response, next: NextFunction) {
      try {
        const {quantity, cartedItemId, id} = req.body;
        const quantityNumber = Number(quantity) || null;

        if(!quantityNumber) {
          return next(ApiError.badRequest(`The quantity is not set!`));
        }

        if(quantityNumber < 1 || quantityNumber > 10) {
          return next(ApiError.badRequest(`The wrong number of products!`));
        }


        const cartedItemInformation = await cartService.findCartedItemInformationTableByCartedItemIdAndUserId(cartedItemId, id);
        if(!cartedItemInformation) {
          return next(ApiError.badRequest(`The item was not found in the basket!`));
        }

        await cartService.updateQuantityOfCartedItem(quantityNumber, cartedItemInformation);
        return res.json(quantityNumber);

      } catch (error) {
          return next(ApiError.badRequest(`Unexpected error - ${error}!`));
      }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
          const {cartedItemId, id} = req.body;

          if(!cartedItemId) {
            return next(ApiError.badRequest('Do not know the id of the item in the basket!'));
          }

          const cartedItem = await cartService.findTableByTableIdAndTableType(CartItem, cartedItemId);
          if(!cartedItem) {
            return next(ApiError.badRequest('The item is not found in your shopping cart!'));
          }
          await cartService.deleteArticleTableById(CartItem, cartedItemId);
          const cart = await cartService.findUserCart(id);
   
          if(!cart) {
            return next(ApiError.badRequest('The basket was not found!'));
          }
        
          return res.json(cart);
            
        } catch (error) {
            return next(ApiError.badRequest(`Unexpected error - ${error}!`));
        }
    }
}

export default new CartController();