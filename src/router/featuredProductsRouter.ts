import { RouterI } from "../model/routerI";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";
import featuredProductController from "../controller/featuredProductController";


export default ({route, router}: RouterI) => {
    router.post(`${route}`, checkRoleMiddleware('ADMIN'), featuredProductController.create);

    router.delete(`${route}`, featuredProductController.delete);

    router.get(`${route}`, featuredProductController.getAll);
};