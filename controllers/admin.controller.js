const Product = require('../models/product.model');
const Order = require('../models/order.model');

async function getProducts(req, res, next) {

    try {
        const products = await Product.findAllProducts();
        res.render("admin/products/all-products", {products: products});
    } catch (error) {
        next(error);
        return;
    }
}

function getNewProduct(req, res) {
    res.render('admin/products/new-product');
}

async function createNewProduct(req, res, next) {
    // console.log(req.body);
    // console.log(req.file);
    const product = new Product({
        ...req.body,
        image: req.file.filename
    }); 

    try {
        await product.saveToDb();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
    try {
       const product = await Product.findProductById(req.params.id);
       res.render('admin/products/update-product', { product: product });
    } catch (error) {
        next(error);
        //return; we dont need to return if there is no code after it
    }
    
};

async function updateProduct(req, res, next) {
    const product = new Product({
        ...req.body,
        _id: req.params.id
    });

    // here we check if in the request we have file then multer will extract it, if not it will be falsy
    if (req.file) {
        // replace the old image with new one
        product.replaceImage(req.file.filename);
    };

    try {
        await product.saveToDb();
    } catch (error) {
        next(error);
        return;
    }
    
    res.redirect('/admin/products');
};

async function deleteProduct(req, res, next) {
    let product;
    try {
        product = await Product.findProductById(req.params.id);
        await product.removeProduct();
    } catch (error) {
        return next(error);
    }

    // here we dont need to redirect when we use ajax method cause will send an error
    //res.redirect('/admin/products');

    res.json({ message: "Deleted product!" });
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render("admin/orders/admin-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: "Order updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};