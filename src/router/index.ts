import {Router} from 'express';
import userRoute from './userRoute';
import itemRouter from './itemRouter';
import brandRouter from './brandRouter';
import typeRouter from './typeRouter';
import newsRouter from './newsRouter';
import advantageRoute from './advantageRoute';
import featuredProductsRouter from './featuredProductsRouter';
import reviewRouter from './reviewRouter';
import rateRoute from './rateRoute';
import cartRoute from './cartRoute';

const router: Router = Router();

export default (): Router => {
    userRoute({route: '/user', router});
    itemRouter({route: '/item', router});
    brandRouter({route: '/brand', router});
    typeRouter({route: '/type', router});
    newsRouter({route: '/news', router});
    advantageRoute({route: '/advantage', router});
    featuredProductsRouter({route: '/featured', router});
    reviewRouter({route: '/review', router});
    rateRoute({route: '/rate', router});
    cartRoute({route: '/cart', router});
    
    return router;
}
