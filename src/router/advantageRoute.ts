import { RouterI } from "../model/routerI";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";
import advantageController from '../controller/advantageController';

export default ({route, router}: RouterI) => {
    router.post(`${route}/`, checkRoleMiddleware('ADMIN'), advantageController.create);

    router.delete(`${route}/`, advantageController.delete);

    router.get(`${route}/`, advantageController.getAll);
}