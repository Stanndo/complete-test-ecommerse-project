const Product = require('../models/product.model');

function getCart(req, res) {
    res.render('client/cart/cart');
}

async function addCartItem(req, res, next) {

    let product;
    try {
        product = await Product.findProductById(req.body.productId);
    } catch (error) {
        next(error);
        return;
    }

    const cart = res.locals.cart;
    cart.addItem(product);

    // updated cart saved back into session
    req.session.cart = cart;

    // 201 succesfully added data and we send back json data 
    res.status(201).json({
        message: 'Cart updated!',
        newTotalItems: cart.totalQuantity
    });
}

function updateCartItem(req, res) {
    const cart = res.locals.cart;

    const updatedItemData = cart.updateCartItem(req.body.productId, req.body.quantity);

    req.session.cart = cart;

    res.json({
        message: "Item updated!",
        updatedCartItem: {
            newTotalQuantity: cart.totalQuantity,
            newTotalPrice: cart.totalPrice,
            updatedItemPrice: updatedItemData.updatedItemPrice 
        }
    });
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    updateCartItem: updateCartItem
}