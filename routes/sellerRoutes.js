const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const qs = require('qs'); // For parsing nested form data

const Product = require('../models/Product');
const Buy = require('../models/checkout');
const User = require('../models/users');

const authToken = require('../middleware/validation');
const isSeller = require('../middleware/checkSeller');
const upload = require('../middleware/uplode-image');

router.use(authToken);
router.use(isSeller);

const productImageUpload = upload.single("images");

function productImageFromFile(file) {
    if (!file) return null;

    return {
        public_id: file.filename,
        url: `/image/Product/${file.filename}`
    };
}

//------------------------------- Create New product---------------------------
router.get('/product/new', (req, res) => {
    res.render('Admin/add.ejs', { seller: req.user });
})

router.post('/product', productImageUpload, async (req, res) => {
    const parseBody = qs.parse(req.body); // ✅ deeply parses nested fields
    const uploadedImage = productImageFromFile(req.file);

    if (!uploadedImage) {
        return res.status(400).send("Please upload a product image.");
    }

    const newProduct = new Product({
        // Generate a unique ID for the product
        productid: uuidv4(),
        image: [uploadedImage],
        name: parseBody.name,
        small_description: parseBody.small_description,
        key_features: parseBody.key_features,
        category: parseBody.category,
        Product_description: parseBody.Product_description ,
        sizes: parseBody.sizes || [],
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

router.post('/product/update/:id', productImageUpload, async(req,res) =>{
    const productId = req.params.id;
    
    let product = await Product.findById(productId);
    if (!product) {
        return res.status(404).render('error/404.ejs', { message: 'Product Not Found' });
    }

    // Update product details
    const parseBody = qs.parse(req.body); // ✅ deeply parses nested fields
    
    try{
        product.name = parseBody.name;
        product.small_description = parseBody.small_description;
        product.key_features = parseBody.key_features;
        product.category = parseBody.category;
        product.Product_description = parseBody.Product_description;
        product.Tech_Specifications = parseBody.Tech_Specifications;
        product.sizes = parseBody.sizes || [];
        // Replace the product image only when a new file is selected.
        const uploadedImage = productImageFromFile(req.file);
        if (uploadedImage) {
            product.image = [uploadedImage];
        } else if (!product.image || product.image.length === 0) {
            return res.status(400).send("Please upload a product image.");
        } else {
            product.image = product.image.slice(0, 1);
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
            return res.status(404).render('error/404.ejs', { message: 'Product Not Found' });
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
            return res.status(404).render('error/404.ejs', { message: 'Order Not Found' });
        }
        console.log("✅ Order deleted successfully", order);
        res.redirect('/seller/orders'); // Redirect to the orders page after deletion
    } catch (err) {
        console.error("❌Error deleting order:", err);
        res.status(500).send("Failed to delete order.");
    }
});

// order status update

router.put('/orders/:orderId/status', async (req, res) => {
    console.log("✅ Order status update request received");
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        console.log("OrderId:", orderId);
        console.log("Status:", status);

        const order = await Buy.findOne({ orderid: orderId }); // ⚠️ IMPORTANT

        if (!order) {
            return res.status(404).render('error/404.ejs', { message: "Order not found" });
        }

        order.status = status;
        await order.save();
        return res.status(200).json({
            message: 'Status updated successfully',
            status: order.status
        });

        // console.log("✅ Order status updated in DB");

        // res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


// ------------------------------- View All Products---------------------------
 

router.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).render('error/404.ejs', { message: 'Product Not Found' });
    }
    res.render('Admin/product-details.ejs', { product, seller: req.user });
});

router.get('/order/details/:id',async(req, res) =>{
    const orderId = req.params.id;
    const order = await Buy.findOne({orderid: orderId });
    if (!order) {
        return res.status(404).render('error/404.ejs', { message: 'Order Not Found' });
    }
    res.render('Admin/order-details.ejs', { order , seller: req.user });
});

router.get('/product/edit/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).render('error/404.ejs', { message: 'Product Not Found' });
    }
    res.render('Admin/edit.ejs', { product, seller: req.user });
});

router.get('/orders', async(req, res) => {
    const orders = await Buy.find({ }).sort({ createdAt: -1 });
    res.render('Admin/orders.ejs', { orders, seller: req.user });
});

router.get('/products', async(req, res) => {
    const allproducts = await Product.find({});
    res.render('Admin/Products-list.ejs', { allproducts, seller: req.user });
});

router.get('/', async(req, res) => {
    const sellerId = req.user._id;
    const seller = await User.findById(sellerId);
    // const orders = await Buy.find({});
    const allproducts = await Product.find({});

    const totalSales = await Buy.countDocuments({
        status: 'Delivered'
    }); 

    const totalOrders = await Buy.countDocuments({
        status: 'Processing'
    });

    const totalProducts = await Product.countDocuments({
    //   userId: req.user._id
    });

    const lowStock = await Product.countDocuments({
    //   userId: req.user._id,
      stock: { $lte: 5 }
    });

    const orders = await Buy.find({ }).sort({ createdAt: -1 }).limit(3);    // sellerId: req.user._id
       // 🔥 latest first
                     // optional (recent orders)


    res.render('Admin/Deshbord.ejs', { 
        
        seller,
        orders,
        allproducts,

        totalSales,
        totalOrders,
      totalProducts,
      lowStock,
      user: req.user
     });
});   


module.exports = router;
