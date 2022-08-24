const express = require("express");

// custom middlewares
const cartController = require("../controllers/cart.controller");

const router = express.Router();

// --------------------------------

router.get('/', cartController.getCart); // path is /   /cart/..

// the path is  /cart/items  the /cart part is settup in app.js
router.post('/items', cartController.addCartItem);  

// we use patch here becuse we updating only parts of the existing data
router.patch('/items', cartController.updateCartItem);

module.exports = router;
