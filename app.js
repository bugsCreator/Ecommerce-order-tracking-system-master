const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const config = require('./config/db');
const flieUpload = require('express-fileupload');

//require routes
const index = require('./routes/index');
const products = require('./routes/products');
const staff = require('./routes/staff');
const tracking = require('./routes/tracking');
const adminPages = require('./routes/adminPages');
const catagories = require('./routes/adminCatagory');
const adminProducts = require('./routes/adminProducts');
const user = require('./routes/user');
const cart = require('./routes/cart');

//conect to db
mongoose.connect(config.dbcon);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected');
});


//initailise app
const app = express();

app.get("/test", (req, res) => {
    //res a index.html file
    return res.sendFile(path.join(__dirname, 'test', 'mapbox.html'));

})

app.get("/test1", (req, res) => {
    //res a index.html file
    return res.sendFile(path.join(__dirname, 'test', 'mapbox1.html'));

})


//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//static file
app.use(express.static(path.join(__dirname, 'public')));

// set global errors variable
app.locals.errors = null;
app.locals.catagories = null;

// //get catgory model
const CatagoryModel = require('./models/catagory');

CatagoryModel.find((err, catagories) => {
    if (err) {
        console.log(err);
    } else {
        app.locals.catagories = catagories;
    }
});


//Express fileUpload
app.use(flieUpload());

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//session middleware
// deepcode ignore HardcodedNonCryptoSecret: <please specify a reason of ignoring this>
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

//express validator middleware
// app.use(expressValidator({
//     customValidators: {
//         isImage: function (value, filename) {
//             var extension = (path.extname(filename)).toLowerCase();
//             switch (extension) {
//                 case 'jpg':
//                     return 'jpg';
//                 case 'jpeg':
//                     return 'jpeg';
//                 case 'png':
//                     return 'png';
//                 case '':
//                     return 'jpg';
//                 default:
//                     return false;
//             }
//         }
//     }
// }));

//express messages
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//session variable for cart
app.get('*', (req, res, next) => {
    res.locals.cart = req.session.cart;
    next();
});


//routes
app.use('/', index);
app.use('/products', products);
app.use('/staff/orders', staff);
app.use('/track', tracking);
app.use('/admin/pages', adminPages);
app.use('/admin/catagories', catagories);
app.use('/admin/products', adminProducts);
app.use('/user', user);
app.use('/cart', cart);


//listen server
app.listen(8080, () => {
    console.log('app is running on port 8080');
});

/**
 * 
 * 
 *   // "body-parser": "^1.18.2",
        // "connect-flash": "^0.1.1",
        // "ejs": "^3.1.8",
        // "express": "^4.16.2",
        // "express-fileupload": "^1.2.1",
        // "express-messages": "^1.0.1",
        // "express-session": "^1.15.6",
        // "express-validator": "^6.14.2",
        // "fs-extra": "^5.0.0",
        // "jpeg-js": ">=0.4.4",
        // "mkdirp": "^0.5.1",
        // "mongoose": "^5.0.3",
        // "resize-img": "^1.1.2"
 * 
 */