const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const qs = require('qs'); // For parsing nested form data

const Product = require('../models/Product');
const Buy = require('../models/checkout');

const upload = require('../middleware/uplode-image');


//------------------------------- Create New product---------------------------
router.get('/product/new', (req, res) => {
    res.render('Admin/add.ejs');
})

router.post('/product',upload.single("images") ,async (req, res) => {
    const parseBody = qs.parse(req.body); // ✅ deeply parses nested fields
    
    const newProduct = new Product({
        // Generate a unique ID for the product
        productid: uuidv4(),
        userId: req.user?.id, // Assuming req.user contains authenticated user infoanonymous
        // image: `/image/Product/${req.file.filename}`,
        image: [{
            public_id: req.file.filename, // Assuming you want to store the filename as public_id
            url: `/image/Product/${req.file.filename}` // Adjust the URL path as needed
        }],
        name: parseBody.productName,
        small_description: parseBody.smallDescription,
        price: parseBody.price,
        key_features: parseBody.key_features,
        stock: parseBody.stock,
        category: parseBody.category,
        Product_description: parseBody.Product_description ,
        Tech_Specifications: parseBody.Tech_Specifications
    });
    console.log(newProduct);
    
        try {
            await newProduct.save(); // ✅ FIXED LINE
            console.log("✅ Product saved successfully");
            res.redirect("/seller/products"); // Redirect to the products page after saving
        } 
        catch (err) {
            console.error("❌Error saving product:", err);
            res.status(500).send("Failed to save product.");
        }
});

//------------------------------- Edit Product---------------------------

router.post('/product/update/:id',upload.single("new_image"),async(req,res) =>{
    const productId = req.params.id;
    
    let product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }

    // Update product details
    const parseBody = qs.parse(req.body); // ✅ deeply parses nested fields
    
    try{
        product.name = parseBody.productName;
        product.small_description = parseBody.smallDescription;
        product.price = parseBody.price;
        product.key_features = parseBody.key_features;
        product.stock = parseBody.stock;
        product.category = parseBody.category;
        product.Product_description = parseBody.Product_description;
        product.Tech_Specifications = parseBody.Tech_Specifications;
        // ✅ Corrected image update
        if (req.file) {
            product.image = [{
                public_id: req.file.filename,
                url: `/image/Product/${req.file.filename}`
            }];
        }
        await product.save();
        console.log("✅ Product updated successfully", product);
        res.redirect('/seller/products'); // Redirect to the products page after updating
    }
    catch(err){
        console.error("❌Error updating product:", err);
        return res.status(500).send("Failed to update product.");
    }

});

//------------------------------- Delete Product---------------------------
router.post('/product/delete/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        console.log("✅ Product deleted successfully", product);
        res.redirect('/seller/products'); // Redirect to the products page after deletion
    }
    catch (err) {
        console.error("❌Error deleting product:", err);
        res.status(500).send("Failed to delete product.");
    }
});

//------------------------------- Order Management---------------------------
router.post('/order/delete/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Buy.findOneAndDelete({ orderid: orderId });
        if (!order) {
            return res.status(404).send('Order not found');
        }
        console.log("✅ Order deleted successfully", order);
        res.redirect('/seller/orders'); // Redirect to the orders page after deletion
    } catch (err) {
        console.error("❌Error deleting order:", err);
        res.status(500).send("Failed to delete order.");
    }
});

// ------------------------------- View All Products---------------------------
router.get('/', async(req, res) => {
    const orders = await Buy.find({});
    const allproducts = await Product.find({});
    res.render('Admin/Deshbord.ejs', { 
        orders,
        allproducts
     });
});    

router.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.render('Admin/product-details.ejs', { product });
});

router.get('/order/details/:id',async(req, res) =>{
    const orderId = req.params.id;
    const order = await Buy.findOne({orderid: orderId });
    if (!order) {
        return res.status(404).send('Order not found');
    }
    res.render('Admin/order-details.ejs', { order });
});

router.get('/product/edit/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.render('Admin/edit.ejs', { product });
});

router.get('/orders', async(req, res) => {
    const orders = await Buy.find({});
    res.render('Admin/orders.ejs', { orders });
});

router.get('/products', async(req, res) => {
    const allproducts = await Product.find({});
    res.render('Admin/Products-list.ejs', { allproducts });
});


module.exports = router;