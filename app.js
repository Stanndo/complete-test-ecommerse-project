const path = require('path');
// third party packages
const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

// custom middlewares
const createSessionConfig = require('./config-session/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-user-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');
const authRoutes = require('./routes/auth.routes');
const baseRoutes = require('./routes/base.routes');
const productsRoutes = require("./routes/products.routes");
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();

// ejs view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// built in static midllerware
app.use(express.static("public"));
app.use("/products/assets/", express.static("product-data"));

// handles and extract incoming request data for requests send upon form submission
app.use(express.urlencoded({ extended: false }));
// handles and extract incoming request data for requests send upon ajax 
app.use(express.json());

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));
// third/party middleware csurf helps generate the token + checks incoming tokens for validity
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

// our mwre just distributes generated tokens to all our other middleware/route handler functions and viwes
app.use(addCsrfTokenMiddleware);  
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes); // only routes which starts with /cart will make to cartRoutes 
// here we place this middleware to protect admin routes
app.use(protectRoutesMiddleware); 
app.use("/orders", ordersRoutes);
app.use("/admin", adminRoutes); 

// app.use('/orders', protectRoutesMiddleware, ordersRoutes);
// app.use('/admin', protectRoutesMiddleware, adminRoutes); 

app.use(notFoundMiddleware);

// server error handler
app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
