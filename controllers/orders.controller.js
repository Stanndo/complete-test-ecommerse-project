const stripe = require("stripe")("sk_test_51Lk4DHK9hTi5x95yUtvvTyhkAdn2G5tVWDij3DSwk4xG7YnEJButzs3kgb2CX7eIwWQqk0EMXCuvQudJmN2WEJtq00xn07i1WX");

const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrders(req, res, next) {
  try {
    // finding all orders for a given user
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("client/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart; // we get access to the cart in the session

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  // cart => contains data from cart
  // userDocument => contains all user data exept password
  const order = new Order(cart, userDocument);

  try {
    // saving to database
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  // with that we reset the cart and clear it from the session
  req.session.cart = null;

  // here we use service/api stripe and create session for handling payment methods
  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map(function(item) {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title
          },
          unit_amount_decimal: +item.product.price
        },
        quantity: item.quantity,
      }
    }), 
    mode: "payment",
    success_url: `localhost:3000/orders/success`,
    cancel_url: `localhost:3000/orders/cancel`,
  });

  res.redirect(303, session.url);

}

function getSuccess(req, res) {
    res.render('client/orders/success');
}

function getCancel(req, res) {
    res.render('client/orders/cancel');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getCancel: getCancel
};
