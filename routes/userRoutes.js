const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const authToken = require('../middleware/validation');

router.use(authToken);
router.use(session({
  secret: 'yourSecretKey', // Change this to a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true only if using HTTPS
}));


// Middleware for file uploads
const upload = require('../middleware/uplode-image');


const User = require('../models/users');
const Product = require('../models/Product');
const Cart = require('../models/cart');
const Buy = require('../models/checkout'); // Assuming you have a Buy model for checkout

//Show Product

router.get('/product-details/:id',async(req,res)=>{
    console.log("Fetching product details for ID:", req.params.id);
    try {
    const productId = req.params.id;
    console.log("Product ID:", productId);
    const product = await Product.findOne({ productid: productId });
    if (!product) {
       console.log('Product not found');
    }

    let cart = null;
    let totalUniqueItems = 0;
    let userId = null;
    
    userId = req.user._id;
    console.log("User ID for product details:", userId);
    // const user = await User.findById(userId);
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

    try {
    const { productId, name, price, quantity, image } = req.body;
    console.log("Product details:", req.body);
    
    // Validate required fields
    if (!productId || !name || !price || !quantity || !image) {
      return res.status(400).send('Missing required fields');
    }

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity);
    
    // Get user ID - use req.user.userId from your User model
    const userId = req.params.id;
    console.log("User ID for adding to cart:", userId);
    
    if (!userId) {
      return res.status(401).send('User not authenticated');
    }

    //Find User
    const user = await User.findById(userId);
    
    if (!user) {
        return res.status(404).send('User not found');      
    }
    console.log("Creating new cart for user:", userId,user);

    // Find or create cart for this user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      
      cart = new Cart({
        userId: req.params.id,
        items: [{
            productId,
            name,
            price: priceNum,
            quantity: quantityNum,
            image,
            total: priceNum * quantityNum
        }]
      });
    }
    console.log("User found for cart:", userId);
    console.log("Cart found/created for user:", cart);

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId === productId
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
        total: priceNum * quantityNum
      });
    }

    // Update cart totals
    cart.totalUniqueItems = cart.items.length;
    cart.subtotal = cart.items.reduce((acc, item) => acc + item.total, 0);
    cart.totalPrice = cart.subtotal * 1.18 + 120;
    cart.updatedAt = Date.now();

    await cart.save();
    console.log("✅ Cart saved for user:", userId, cart);

    // Redirect to cart page
    res.redirect(`/cart/${userId}`);
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).send("Error adding to cart");
  }
});

// Remove item from cart

router.post('/cart/remove/:id', async (req, res) => {
    const userId = req.user.userId;
    console.log("User ID for cart removal:", userId);
    const productId = req.params.id;

    try {
        // Find cart for this user
        let cart = await Cart.findOne({userId });

        if (!cart) {
            console.log("No cart found.");
            return res.redirect(`/cart/${req.user._id}`);
        }

        // Find item index
        const itemIndex = cart.items.findIndex(item => item.productId === productId);

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
        cart.totalPrice = cart.subtotal * 1.18 + 120;
        cart.updatedAt = Date.now();

        await cart.save();
        console.log("✅ Cart updated:", cart);

        res.redirect(`/cart/${userId}`);
    } catch (err) {
        console.error("❌ Error removing from cart:", err);
        res.status(500).send("❌ Error removing from cart");
    }
});



//========================================Buying Routes========================================//

router.post('/product/checkout/:id', async (req, res) => {
    const {productId, name, price, quantity, image}= req.body;

     // Store product data in session
    try { 
        req.session.checkoutData = {
            productId,
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            image,
            subtotal: price * quantity,
            totalPrice: (price * quantity) * 1.18 + 120
        };
        // console.log("✅ Buy saved:", req.session.checkoutData);
        res.redirect(`/chekout/${productId}`);
    }
    catch (err) {
        console.error("❌ Error saving buy:", err);
        return res.status(500).send("❌ Error saving buy");
    }        
});

router.post('/product/buy/:id', async (req, res) => {
    const checkoutData = req.session.checkoutData;

    if (!checkoutData) {
        return res.status(400).send("Session expired. Please start checkout again.");
    }

    const { firstname, lastname, email, phone, address, city, state, pincode } = req.body;

    const orderId = uuidv4();
    const priceNum = checkoutData.price;
    const quantityNum = checkoutData.quantity;

    // Create a new Buy instance
    try {
         req.session.buyData = {
            orderid: orderId,
            productId: checkoutData.productId,
            firstname,
            lastname,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            country: "India",
            items: [{
                name: checkoutData.name,
                price: priceNum,
                quantity: quantityNum,
                image: checkoutData.image,
                total: priceNum * quantityNum
            }],
            subtotal: priceNum * quantityNum,
            totalPrice: (priceNum * quantityNum) * 1.18 + 120,
        };


        console.log("✅ First Buy saved:", req.session.buyData);
        res.redirect(`/payment/${orderId}`);
    } 
    catch (err) {
        console.error("❌ Error saving final buy:", err);
    }
});

router.post('/product/confirm/:id', async (req, res) => {
    const buyData = req.session.buyData;
    if (!buyData) {
        return res.status(400).send("Session expired. Please start checkout again.");
    }
    const { paymentMethod } = req.body;
    const orderId = buyData.orderid;
    const productId = buyData.productId;

    try {
        let buy = new Buy({
        userId: req.user._id,    
        orderid: orderId,
        productId: buyData.productId,
        firstname: buyData.firstname,
        lastname: buyData.lastname,
        email: buyData.email,
        phone: buyData.phone,
        address: buyData.address,
        city: buyData.city,
        state: buyData.state,
        pincode: buyData.pincode,
        country: "India",
        items: [{
            name: buyData.items[0].name,
            price: buyData.items[0].price,
            quantity: buyData.items[0].quantity,
            image: buyData.items[0].image,
            total: buyData.items[0].total
        }],
        paymentMethod: paymentMethod,
        transactionId: uuidv4(), // Assuming you want to generate a new transaction ID
        createdAt: Date.now(),
        subtotal: buyData.subtotal,
        totalPrice: buyData.totalPrice,
    });
    await buy.save();
    req.session.buyData = null; 
    req.session.checkoutData = null; 
    console.log("✅ Final Buy saved:", buy);

    
    const products = await Product.find({id: productId});
    if (products.length > 0) {
        const product = products[0];
        product.stock -= buy.items[0].quantity; // Reduce stock by the quantity purchased
        await product.save();
        console.log("✅ Product stock updated:", product);
    } else {
        console.error("❌ Product not found for ID:", productId);
    }

    // Redirect to order confirmation page
    console.log("✅ Redirecting to confirmation:");
    res.redirect(`/order-confirmation/${buy.orderid}`);
    } 
    catch (err) {
        console.error("❌ Error saving final buy:", err);
    }

});



//---------------------------Account Edit-----------------------------

router.post('/account/edit/:id', upload.single('profilePhoto'), async (req, res) => {
    const userId = req.params.id;
    console.log("User ID for account edit:", userId);
    const { profilePhoto, username, password, email, phone, dob, street1,street2, city, state, pincode, country } = req.body;
    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
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
        console.log("✅ User updated successfully:", user);
        if(password){
            res.clearCookie('token');
        }
        res.redirect(`/deshbord/${user._id}`);
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
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
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

        res.redirect(`/deshbord/${user._id}`);

    } catch (err) {
        console.error("❌ Error updating address:", err);
        res.status(500).send("Server Error");
    }
});


//--------------------- Routes for customer views-------------------------------
// All Routes

router.get('/chekout/:id', async(req,res)=>{
    const productId = req.params.id;
    const userId = req.user._id;
    const cartArray = await Cart.find({});
    const user = await User.findById(userId);
    const cart = cartArray[0]; // Assuming you want to fetch the first cart

    if (!req.session.checkoutData) {
        return res.redirect(`/product/${userId}`);
    }

    res.render('customer/checkout.ejs', {
        user,
        product: req.session.checkoutData, // So you can show summary
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
        userId: req.user._id,
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

    console.log("Fetching cart for user:", req.params.id);
    const userId = req.params.id;
    console.log("Fetching cart for user:", userId);

    if(!userId) {
        console.log("User ID not found, redirecting to signin");
        // res.clearCookie('token');
        // redirect('/auth/signin');
    }
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
        console.log("No cart found for user:", userId);
        return res.render('customer/cart.ejs', {
            userId,
            cartItems: [],
            total: 0,
            subtotal: 0,
            totalPrice: 0,
            totalUniqueItems: 0   
        });
    }

    // If cart found → render cart normally
    console.log("Cart found for user:", userId, cart);
    res.render('customer/cart.ejs', {
        userId,
        cartItems: cart.items,
        total: cart.total,
        subtotal: cart.subtotal,
        totalPrice: cart.totalPrice,
        totalUniqueItems: cart.items.length   
    });
});

router.get('/deshbord/:id',async(req,res)=>{
    const userId = req.params.id;
    let user = await User.findOne({ _id: userId });
    if (!user) {
        return res.status(404).send('User not found');
    }

    const buyOrders = await Buy.find({ userId: userId });
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
    const user = await User.findById(userId);
    console.log("Order details:", order);
    res.render('customer/order-details.ejs', { order , user });
});

//--------------------- Product Listing -------------------------------
router.get('/product/:id',async(req,res)=>{
    const userId = req.params.id;
    console.log("User ID for product listing:", userId);

    // Fetch all products from the database
    const user = await User.findById(userId);
    const allproducts = await Product.find({});
    console.log(allproducts);
    res.render('customer/product.ejs', { allproducts, user,userId });
});


router.get('/',(req,res)=>{
    res.render('customer/index.ejs');
});

module.exports = router;