const express = require("express");

// custom middlewares

const productsController = require('../controllers/products.controller');

const router = express.Router();

// --------------------------------

router.get('/products', productsController.getAllProducts);

router.get('/products/:id', productsController.getProductDetails);

module.exports = router;
