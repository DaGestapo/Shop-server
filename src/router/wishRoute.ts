import { RouterI } from '../model/routerI';
import wishController from '../controller/wishController';
import authMiddleware from '../middleware/authMiddleware';

export default ({route, router}: RouterI) => {
    router.post(`${route}/`, authMiddleware, wishController.create);

    router.delete(`${route}/`, authMiddleware, wishController.deleteWishItem);

    router.get(`${route}/`, authMiddleware, wishController.getWish);

}