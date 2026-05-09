const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');

router.use(session({
  secret: 'yourSecretKey', // Change this to a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true only if using HTTPS
}));


// Middleware for file uploads
const upload = require('../middleware/uplode-image');
const authToken = require('../middleware/validation');
const isBuyer = require('../middleware/checkBuyer');


const User = require('../models/users');
const Product = require('../models/Product');
const Cart = require('../models/cart');
const Buy = require('../models/checkout'); // Assuming you have a Buy model for checkout

router.use(authToken);
router.use(isBuyer);

//Show Product

router.get('/product-details/:id',async(req,res)=>{
    try {
        const productId = req.params.id;
        console.log("Product ID:", productId);
        const product = await Product.findOne({ productid: productId });
        if (!product) {
        //    console.log('Product not found');
        //    return res.status(404).send('Product not found');
            return res.status(404).render('error/404.ejs', { message: 'Product Not Found' });
        }

        let cart = null;
        let totalUniqueItems = 0;
        let userId = null;
        
        userId = req.user._id;
        console.log("User ID for product details:", userId);
        // const user = await User.findOne({ userId: userId });
        cart = await Cart.findOne({ userId: userId });
        res.render('customer/product-details.ejs', { 
            userId,
            product: product,
            totalUniqueItems: cart ? cart.items.length : 0
        });
    } catch (err) {
        console.error("❌ Error loading product details:", err);
        res.status(500).send("Error loading product details");
    }
});

//======================================== Add to cart ===============================

router.post('/cart/add/:id', async (req, res) => {

    console.log("Cart Route ID :",req.params.id)

    try {
        const { productId, name, price, quantity, image, category, Material,Model_number, size } = req.body;
        
        // Validate required fields
        if (!productId || !name || !price || !quantity ||!Model_number || !image) {
            return res.status(400).send('Missing required fields');
        }

        const priceNum = parseFloat(price);
        const quantityNum = parseInt(quantity);
        
        // Get user ID - use req.user.userId from your User model
        const userId = req.params.id;
        // console.log("User ID for add to cart:", userId);
        
        if (!userId) {
            return res.status(401).send('User not authenticated');
        }

        //Find User
        const user = await User.findOne({ _id: userId });
        
        if (!user) {
            // return res.status(404).send('User not found');
            return res.status(404).render('error/404.ejs', { message: 'User Not Found' });
        }

        // Find or create cart for this user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
        
        cart = new Cart({
            userId: req.user._id,
            items: [{
                productId,
                name,
                price: priceNum,
                quantity: quantityNum,
                image,
                category,
                Model_number,
                Material,
                size,
                total: priceNum * quantityNum
            }]
        });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(item =>
            item.productId === productId &&
            item.category === category &&
            item.Material === Material &&
            item.size === size &&
            item.Model_number === Model_number
        );

        if (existingItemIndex > -1) {
        // Update existing item
        cart.items[existingItemIndex].quantity += quantityNum;
        cart.items[existingItemIndex].total = 
            cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].price;
        } else {
        // Add new item
        cart.items.push({
            productId,
            name,
            price: priceNum,
            quantity: quantityNum,
            image,
            category,
            Model_number,
            Material,
            size,
            total: priceNum * quantityNum
        });
        }

        // Update cart totals
        cart.totalUniqueItems = cart.items.length;
        cart.tax = cart.items.reduce((acc, item) => acc + (item.price * item.quantity * 0.18), 0);
        cart.subtotal = cart.items.reduce((acc, item) => acc + item.total, 0);
        cart.totalPrice = cart.subtotal * 1.18 + 40;
        cart.updatedAt = Date.now();

        await cart.save();
        // console.log("✅ Cart saved for user:", userId, cart);

        // Redirect to cart page
        res.redirect(`/buyer/cart/${userId}`);
    } 
    catch (err) {
        console.error("❌ Error adding to cart:", err);
        res.status(500).send("Error adding to cart");
    }
});

// Remove item from cart

router.post('/cart/remove/:id', async (req, res) => {
    const userId = req.user._id;
    console.log("User ID for cart removal:", userId);
    const productId = req.params.id;
    const { category, Material, size , Model_number } = req.body;

    try {
        // Find cart for this user
        let cart = await Cart.findOne({userId });

        if (!cart) {
            console.log("No cart found.");
            return res.redirect(`/buyer/cart/${req.user._id}`);
        }

        // Find item index
        const itemIndex = cart.items.findIndex(item =>
            item.productId === productId &&
            item.category === category &&
            item.Material === Material &&
            item.size === size 
        );


        if (itemIndex > -1) {
            console.log("Removing item from cart...");

            // Remove item
            cart.items.splice(itemIndex, 1);
            // let deletedListing = await Cart.findByIdAndDelete(productId);
            console.log("Deleted listing:", cart.items[itemIndex]);
        } else {
            console.log("⚠ Item not found:", productId);
        }

        // Update cart totals
        cart.totalUniqueItems = cart.items.length;
        cart.subtotal = cart.items.reduce((acc, item) => acc + item.total, 0);
        cart.totalPrice = cart.subtotal * 1.18 + 40;
        cart.updatedAt = Date.now();

        await cart.save();
        console.log("✅ Cart updated:", cart);

        res.redirect(`/buyer/cart/${userId}`);
    } catch (err) {
        console.error("❌ Error removing from cart:", err);
        res.status(500).send("❌ Error removing from cart");
    }
});



//========================================Buying Routes========================================//

router.post('/product/checkout/:id', async (req, res) => {
    const Id = req.params.id;
    const {productId, name, price, quantity, size, image}= req.body;

    const product = await Product.findOne({ productid: Id });
    const cart = await Cart.findOne({ userId: Id });
    
     // Store product data in session
    try { 
        if(product) {
            console.log("Saving checkout data for product:");
            req.session.checkoutData = {
                orderid:uuidv4(),
                items: [{
                    productId,
                    name,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    image,
                    Model_number : product.Tech_Specifications[0].Model_number,
                    category: product.category,
                    Material: product.Tech_Specifications[0].Material,
                    size,
                }],
                subtotal: price * quantity,
                tax: ((price * 18)/100)*quantity,
                totalPrice: (price * quantity) * 1.18 + 40
            };
        }
        if(cart) {
            console.log("Saving checkout data for cart:");
            req.session.checkoutData = {
                orderid: uuidv4(),
                items: cart.items,
                totalUniqueItems: cart.totalUniqueItems,
                subtotal: cart.subtotal,
                tax: cart.subtotal * 0.18,
                totalPrice: cart.totalPrice
            };
        }
        console.log("✅ Buy saved:", req.session.checkoutData);
        res.redirect(`/buyer/chekout/${productId}`);
    }
    catch (err) {
        console.error("❌ Error saving buy:", err);
        return res.status(500).send("❌ Error saving buy");
    }        
});

router.post('/product/buy/:id', async (req, res) => {
    const productId = req.params.id;
    console.log("Buy request for order ID:", productId);
    const checkoutData = req.session.checkoutData;

    if (!checkoutData) {
        return res.status(400).send("Session expired. Please start checkout again.");
    }

    const { firstname, lastname, email, phone, address, city, state, pincode } = req.body;

    
    const priceNum = checkoutData.price;
    const quantityNum = checkoutData.quantity;

    // Create a new Buy instance
    try {
         req.session.buyData = {
            orderId: checkoutData.orderid,
            firstname,
            lastname,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            country: "India",
            items: checkoutData.items,
            totalUniqueItems: checkoutData.items.length,
            subtotal: checkoutData.subtotal,
            tax: checkoutData.tax,
            totalPrice: checkoutData.totalPrice,
        };


        console.log("✅ First Buy saved:", req.session.buyData);
        res.redirect(`/buyer/payment/${checkoutData.orderid}`);
    } 
    catch (err) {
        console.error("❌ Error saving final buy:", err);
    }
});

router.post('/product/confirm/:id', async (req, res) => {
    const productId = req.params.id;
    console.log("Final confirmation for order ID:", productId);
    const buyData = req.session.buyData;
    if (!buyData) {
        return res.status(400).send("Session expired. Please start checkout again.");
    }
    const { paymentMethod } = req.body;

    try {
        let buy = new Buy({
            userId: req.user._id,    
            orderid: buyData.orderId,
            firstname: buyData.firstname,
            lastname: buyData.lastname,
            email: buyData.email,
            phone: buyData.phone,
            address: buyData.address,
            city: buyData.city,
            state: buyData.state,
            pincode: buyData.pincode,
            country: buyData.country,
            items: buyData.items,
            totalUniqueItems: buyData.items.length,
            paymentMethod: paymentMethod,
            transactionId: uuidv4(), // Assuming you want to generate a new transaction ID
            createdAt: Date.now(),
            subtotal: buyData.subtotal,
            tax: buyData.tax,
            totalPrice: buyData.totalPrice,
        });
        await buy.save();
        req.session.buyData = null; 
        req.session.checkoutData = null; 
        console.log("✅ Final Buy saved:", buy);
        
        // 🔥 STOCK UPDATE FOR MULTIPLE ITEMS
        console.log("Updating stock for products in order...");
        for (let item of buyData.items) {
            const product = await Product.findOne({ productid: item.productId });
            console.log(product);
            if (product) {
                console.log(`Updating stock for product ${product.productid}: current stock ${product.stock}, reducing by ${item.quantity}`);
                product.stock -= item.quantity;
                await product.save();
                console.log(`✅ Stock updated for product ${product.productid}: new stock ${product.stock}`);
            }
        }
        // Redirect to order confirmation page
        console.log("✅ Redirecting to confirmation:");
        res.redirect(`/buyer/order-confirmation/${buyData.orderId}`);
    } 
    catch (err) {
        console.error("❌ Error saving final buy:", err);
    }

});



//---------------------------Account Edit-----------------------------

router.post('/account/edit/:id', upload.single('profilePhoto'), async (req, res) => {
    const userId = req.params.id;
    console.log("User ID for account edit:", userId);
    const {  username, password, email, phone, dob, street1,street2, city, state, pincode, country } = req.body;
    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            // return res.status(404).send('User not found');
            return res.status(404).render('error/404.ejs', { message: 'User Not Found' });
        }
        if (req.file){
            user.profilePhoto = [{
                public_id: req.file.filename, // Assuming you want to store the filename as public_id
                url: `/image/Product/${req.file.filename}` // Adjust the URL path as needed
            }];
        }
        if(password){
            const bcrypt = require('bcrypt');
            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds);
            user.password = hash;
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.dob = dob || user.dob;
        user.street1 = street1 || user.street1;
        user.street2 = street2 || user.street2;
        user.city = city || user.city;
        user.state = state || user.state;
        user.pincode = pincode || user.pincode;
        user.country = country || user.country;

        await user.save();
        // console.log("✅ User updated successfully:", user);
        if(password){
            res.clearCookie('token');
        }
        res.redirect(`/buyer/deshbord/${user._id}`);
    } 
    catch (err) {
        console.error("❌ Error updating account:", err);
    }
});


//------------------------Address Add and Edit-----------------------------

router.post('/address/edit/:id', async (req, res) => {
    const userId = req.params.id;
    const { street1, street2, city, state, pincode, country } = req.body;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            // return res.status(404).send('User not found');
            return res.status(404).render('error/404.ejs', { message: 'User Not Found' });
        }

        // ✅ Ensure address array exists
        if (!user.address || user.address.length === 0) {
            user.address = [{}];
        }

        // ✅ Now safe to update
        user.address[0].street1 = street1 || user.address[0].street1;
        user.address[0].street2 = street2 || user.address[0].street2;
        user.address[0].city = city || user.address[0].city;
        user.address[0].state = state || user.address[0].state;
        user.address[0].pincode = pincode || user.address[0].pincode;
        user.address[0].country = country || user.address[0].country;

        await user.save();

        console.log("✅ Address updated successfully:", user);

        res.redirect(`/buyer/deshbord/${user._id}`);

    } catch (err) {
        console.error("❌ Error updating address:", err);
        res.status(500).send("Server Error");
    }
});


//--------------------- Routes for customer views-------------------------------
// All Routes

router.get('/chekout/:id', async(req,res)=>{
    const productId = req.params.id;
    const userId = req.user.userId;
    const cartArray = await Cart.find({});
    const user = await User.findOne({ userId: userId });
    const cart = cartArray[0]; // Assuming you want to fetch the first cart

    if (!req.session.checkoutData) {
        return res.redirect(`/product/${userId}`);
    }

    res.render('customer/checkout.ejs', {
        user,
        order: req.session.checkoutData, // So you can show summary
        totalUniqueItems: cart.items.length
    });
});

router.get('/payment/:id',async(req,res)=>{
    const cartArray = await Cart.find({});
    const cart = cartArray[0];

    if (!req.session.buyData) {
        return res.redirect(`/product/${req.params.id}`);
    }
    res.render('customer/payment.ejs',{
        userId: req.user.userId,
        order: req.session.buyData,
        totalUniqueItems: cart.items.length
    });
});

router.get('/order-confirmation/:id', async (req, res) => {
    const cartArray = await Cart.find({});
    const cart = cartArray[0]; // Assuming you want to fetch the first cart
    const orderId = req.params.id;
    console.log("Order ID:", orderId);
    const order = await Buy.findOne({ orderid: orderId });
    console.log("Order details:", order);
    res.render('customer/OrderConfarm.ejs', { 
        userId: req.user._id,
        order,
        totalUniqueItems: cart.items.length
     });  
});

router.get('/contact',(req,res)=>{
    res.render('customer/contect.ejs');
});

router.get('/about',(req,res)=>{
    res.render('customer/about.ejs');
});

router.get('/cart/:id', async(req,res)=>{
    const userId = req.params.id;

    if(!userId) {
        // console.log("User ID not found, redirecting to signin");
        // res.clearCookie('token');
        // redirect('/auth/signin');
        return res.redirect('/error/404', { message: 'User Not Found' });
    }
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
        return res.render('customer/cart.ejs', {
            userId,
            cart,
            cartItems: [],
            total: 0,
            subtotal: 0,
            tax: 0,
            totalPrice: 0,
            totalUniqueItems: 0   
        });
    }

    // If cart found → render cart normally
    res.render('customer/cart.ejs', {
        userId,
        cartItems: cart.items,
        total: cart.total,
        subtotal: cart.subtotal,
        tax: cart.tax,
        totalPrice: cart.totalPrice,
        totalUniqueItems: cart.items.length   
    });
});

router.get('/deshbord/:id',async(req,res)=>{
    const userId = req.params.id;
    console.log("User ID on Dashbord : ",userId);
    let user = await User.findOne({ _id: userId });
    if (!user) {
        // return res.status(404).send('User not found');
        return res.status(404).render('error/404.ejs', { message: 'User Not Found' });
    }

    const buyOrders = await Buy.find({ userId: userId });
    console.log("Buy Orders for user:", buyOrders);
    // user = user.toObject();
    // user.buyOrders = buyOrders;
    // Fetch all products from the database
    res.render('customer/deshbord.ejs', { user , buyOrders});
}); 

//--------------------- Account Edit and Order Details -------------------------------
router.get('/accountedit/:id',async(req,res)=>{
    const userId = req.params.id;
    console.log("User ID for orders:", userId);
    let user = await User.findOne({ _id: userId });
    res.render('customer/accountEdit.ejs', { user });
});

//--------------------- Order Details -------------------------------
router.get('/order-details/:id',async(req,res)=>{
    const orderId = req.params.id;
    const userId = req.user._id;
    console.log("Order ID for details:", orderId);
    const order = await Buy.findOne({ orderid: orderId });
    const user = await User.findOne({ _id: userId });
    console.log("Order details:", order);
    res.render('customer/order-details.ejs', { order , user });
});

//--------------------- Product Listing -------------------------------
router.get('/product/:id',async(req,res)=>{
    const userId = req.params.id;
    console.log("User ID : ",userId)
    // Fetch all products from the database
    const user = await User.findOne({ _id: userId });
    const allproducts = await Product.find({});
    console.log(user);
    res.render('customer/product.ejs', { allproducts, user,userId });
});

module.exports = router;