import { RouterI } from '../model/routerI';
import userController from '../controller/userController';
import authMiddleware from '../middleware/authMiddleware';

export default ({route, router}: RouterI) => {
    router.post(`${route}/registration`, userController.registration.bind(userController));

    router.post(`${route}/login`, userController.login.bind(userController));

    router.delete(`${route}/`, authMiddleware, userController.deleteAccount);

    router.get(`${route}/auth`, authMiddleware, userController.auth);

    router.get(`${route}/:id`, authMiddleware, userController.getBalance);
}
