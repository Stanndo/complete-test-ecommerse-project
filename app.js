const path = require('path');
// third party packages
const express = require('express');
const csrf = require('csurf');

// custom middlewares
const db = require("./data/database");
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const authRoutes = require("./routes/auth.routes");

const app = express();

// ejs view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// built in static midllerware
app.use(express.static("public"));
app.use(express.urlencoded({exteneded: false}));

// third/party middleware csurf helps generate the token + checks incoming tokens for validity
app.use(csrf());
// our mwre just distributes generated tokens to all our other middleware/route handler functions and viwes
app.use(addCsrfTokenMiddleware);  

app.use(authRoutes);

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
