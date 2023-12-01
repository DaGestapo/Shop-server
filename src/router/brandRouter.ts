import { RouterI } from '../model/routerI';
import brandController from '../controller/brandController';
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

export default ({route, router}: RouterI) => {
    router.post(`${route}/`, checkRoleMiddleware('ADMIN'), brandController.create);

    router.get(`${route}/:id`, brandController.getOneById);

    router.delete(`${route}/`, brandController.delete);

    router.get(`${route}/`, brandController.getAll);
}