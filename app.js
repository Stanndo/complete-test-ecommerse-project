const path = require('path');
// third party packages
const express = require('express');

// custom middlewares
const authRoutes = require('./routes/auth.routes');


const app = express();

// ejs view engine setup 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// built in static midllerware
app.use(express.static('public'));

app.use(authRoutes);

app.listen(3000);