import { RouterI } from '../model/routerI';
import itemController from '../controller/itemController';
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

export default ({route, router}: RouterI) => {
    router.post(`${route}/`, checkRoleMiddleware('ADMIN'), itemController.create);

    router.get(`${route}/:id`, itemController.getOne);

    router.get(`${route}/`, itemController.getAll);

    router.get(`${route}/info/:id`, itemController.getItemInformation);


}