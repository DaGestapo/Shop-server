import { RouterI } from '../model/routerI';
import newsController from '../controller/newsController';
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

export default ({route, router}: RouterI) => {
    router.post(`${route}/`, checkRoleMiddleware('ADMIN'), newsController.create);

    router.delete(`${route}/:id`, newsController.delete);

    router.get(`${route}/`, newsController.get);
}