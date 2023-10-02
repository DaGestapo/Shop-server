import { RouterI } from '../model/routerI';
import rateController from '../controller/rateController';
import authMiddleware from '../middleware/authMiddleware';

export default ({route, router}: RouterI) => {
    router.post(`${route}/`, authMiddleware, rateController.create);

    router.delete(`${route}/`, authMiddleware, rateController.delete);
}