import { RouterI } from '../model/routerI';
import cartController from '../controller/cartController';
import authMiddleware from '../middleware/authMiddleware';

export default ({route, router}: RouterI) => {
    router.post(`${route}/`, authMiddleware, cartController.create);

    router.delete(`${route}/`, authMiddleware, cartController.delete);

    router.get(`${route}/`, authMiddleware, cartController.getCart);

    router.put(`${route}/`, authMiddleware, cartController.changeQuantity);
}