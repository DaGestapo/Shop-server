import { RouterI } from '../model/routerI';
import reviewController from '../controller/reviewController';
import authMiddleware from '../middleware/authMiddleware';

export default ({route, router}: RouterI) => {
    router.post(`${route}/`, authMiddleware, reviewController.create);

    router.delete(`${route}/`, authMiddleware, reviewController.delete);

    router.put(`${route}`, authMiddleware, reviewController.changeReview);

    router.get(`${route}/:id`, reviewController.getAll);
}