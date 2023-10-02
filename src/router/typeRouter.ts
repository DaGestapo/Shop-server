import { RouterI } from '../model/routerI';
import typeController from '../controller/typeController';
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

export default ({route, router}: RouterI) => {
    router.post(`${route}/`, checkRoleMiddleware('ADMIN'), typeController.create);

    router.delete(`${route}/`, checkRoleMiddleware('ADMIN'), typeController.delete);

    router.get(`${route}/`, typeController.getAll);
}