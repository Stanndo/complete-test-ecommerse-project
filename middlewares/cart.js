// lookin in the incoming requests and determin if they are coming from a user 
// who allready has a cart or who doesnt
const Cart = require('../models/cart.model');

function initializeCart(req, res, next) {
    let cart;

    if(!req.session.cart) {
        cart = new Cart();
    } else {
        const sessionCart = req.session.cart;
        cart = new Cart(sessionCart.items, sessionCart.totalQuantity, sessionCart.totalPrice);
    }

    // making this req/res cycle available to all other functions and views
    res.locals.cart = cart;

    next();
}

module.exports = initializeCart;