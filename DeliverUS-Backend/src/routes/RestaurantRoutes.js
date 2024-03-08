import OrderController from '../controllers/OrderController.js'
import ProductController from '../controllers/ProductController.js'
import RestaurantController from '../controllers/RestaurantController.js'
import { create } from '../controllers/validation/RestaurantValidation.js'
import { hasRole, isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { handleFilesUpload } from '../middlewares/FileHandlerMiddleware.js'
import { checkOrderOwnership } from '../middlewares/OrderMiddleware.js'
import { checkProductOwnership } from '../middlewares/ProductMiddleware.js'
import { checkRestaurantOwnership, restaurantHasNoOrders } from '../middlewares/RestaurantMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { Restaurant } from '../models/models.js'

const loadFileRoutes = function (app) {
  app.route('/restaurants')
    .get(
      RestaurantController.index)
    .post(
    // TODO: Add needed middlewares
      isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['image'], process.env.RESTAURANTS_FOLDER),
      create,
      handleValidation,
      checkRestaurantOwnership,
      RestaurantController.create)

  app.route('/restaurants/:restaurantId')
    .get(checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantController.show)
    .put(
    // TODO: Add needed middlewares
      isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['image'], process.env.PRODUCTS_FOLDER),
      checkEntityExists(Restaurant, 'restaurantId'),
      checkRestaurantOwnership,
      handleValidation,
      RestaurantController.update)
    .delete(
    // TODO: Add needed middlewares
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      checkRestaurantOwnership,
      restaurantHasNoOrders,
      RestaurantController.destroy)

  app.route('/restaurants/:restaurantId/orders')
    .get(
    // TODO: Add needed middlewares
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      checkRestaurantOwnership,
      checkOrderOwnership,
      OrderController.indexRestaurant)

  app.route('/restaurants/:restaurantId/products')
    .get(
    // TODO: Add needed middlewares
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      checkRestaurantOwnership,
      checkProductOwnership,
      ProductController.indexRestaurant)

  app.route('/restaurants/:restaurantId/analytics')
    .get(
    // TODO: Add needed middlewares
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      checkRestaurantOwnership,
      OrderController.analytics)
}
export default loadFileRoutes
