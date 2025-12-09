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



const User = require('../models/users');
const Product = require('../models/Product');
const Cart = require('../models/cart');
const Buy = require('../models/checkout'); // Assuming you have a Buy model for checkout

//Show Product

router.get('/product-details/:id',async(req,res)=>{
    const productId = req.params.id;
    const product = await Product.findOne({ productid: productId });
    if (!product) {
       console.log('Product not found');
    }  
    // let cart = await Cart.findOne({ userId: req.user._id });
    // if (!cart) {
    //     console.log("No cart found, creating a new one...");
    //     continue;
    // }

    let cart = null;
    let totalUniqueItems = 0;
    let userId = null;

    // Only try to load cart if user is logged in
    if (req.user && req.user.userId) {
        userId = req.user.userId;
        cart = await Cart.findOne({ userId: req.user.userId });

        if (cart) {
            totalUniqueItems = cart.items ? cart.items.length : 0;
        }
    }
    res.render('customer/product-details.ejs', { 
        userId,
        product: product,
        totalUniqueItems
    });
});

//--------------------- Add to cart-------------------------------

router.post('/cart/add/:id', async (req, res) => {
    const { productId, name, price, quantity, image } = req.body;

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity);

    try {
        let cart = await Cart.findOne({userId: req.user._id}); // find cart (for now, just fetch first cart)

        if (!cart) {
            console.log("No cart found, creating a new one...");
            cart = new Cart({
                userId: req.user._id,
                items: [{
                    productId,
                    name,
                    price: priceNum,
                    quantity: quantityNum,
                    image,
                    total: priceNum * quantityNum
                }]
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId === productId);

            if (itemIndex > -1) {
                console.log("Product already exists in cart, updating...");
                cart.items[itemIndex].quantity += quantityNum;
                cart.items[itemIndex].total = cart.items[itemIndex].quantity * cart.items[itemIndex].price;
            } else {
                console.log("New product, adding to cart...");
                cart.items.push({
                    productId,
                    name,
                    price: priceNum,
                    quantity: quantityNum,
                    image,
                    total: priceNum * quantityNum
                });
            }
        }

        // Update cart totals
        cart.totalUniqueItems = cart.items.length;
        cart.subtotal = cart.items.reduce((acc, item) => acc + item.total, 0);
        cart.totalPrice = cart.subtotal * 1.18 + 120;
        cart.updatedAt = Date.now();

        await cart.save();
        console.log("✅ Cart saved:", cart);

        res.redirect(`/cart/${req.user._id}`);
    } catch (err) {
        console.error("❌ Error adding to cart:", err);
        res.status(500).send("❌ Error adding to cart",err);
    }
});

// Remove item from cart

router.post('/cart/remove/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        let cart = await Cart.findOne({});

        if (!cart) {
            console.log("No cart found.");
            return res.redirect(`/cart/${req.user._id}`);
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            console.log("Removing item from cart...");
            cart.items.splice(itemIndex, 1);
            // let deletedListing = await Cart.findByIdAndDelete(productId);
            console.log("Deleted listing:", cart.items[itemIndex]);
        } else {
            console.log("Item not found in cart.");
        }

        // Update cart totals
        cart.subtotal = cart.items.reduce((acc, item) => acc + item.total, 0);
        cart.totalPrice = cart.subtotal * 1.18 + 120;
        cart.updatedAt = Date.now();

        await cart.save();
        console.log("✅ Cart updated:", cart);

        res.redirect(`/cart/${req.user._id}`);
    } catch (err) {
        console.error("❌ Error removing from cart:", err);
        res.status(500).send("❌ Error removing from cart");
    }
});



//--------------------- Buy-------------------------------

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


        // console.log("✅ First Buy saved:", req.session.buyData);
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



//--------------------- Routes for customer views-------------------------------
// All Routes

router.get('/chekout/:id', async(req,res)=>{
    const cartArray = await Cart.find({});
    const cart = cartArray[0]; // Assuming you want to fetch the first cart

    if (!req.session.checkoutData) {
        return res.redirect(`/product/${userId}`);
    }

    res.render('customer/checkout.ejs', {
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
    //   const userId = req.params.id;

    // try {
    //     const cart = await Cart.findOne({ userId });

    //     if (!cart) {
    //         return res.render('customer/cart.ejs', {
    //             cartItems: [],
    //             total: 0,
    //             subtotal: 0,
    //             totalPrice: 0,
    //             totalUniqueItems: 0
    //         });
    //     }

    //     res.render('customer/cart.ejs', {
    //         cartItems: cart.items,
    //         total: cart.totalPrice,
    //         subtotal: cart.subtotal,
    //         totalPrice: cart.totalPrice,
    //         totalUniqueItems: cart.items.length
    //     });

    // } catch (err) {
    //     console.error("Error loading cart:", err);
    //     res.status(500).send("Error loading cart");
    // }

    const userId = req.params.id;
    const cartArray = await cart.findOne({ userId });
    const cart = cartArray[0];
//  Assuming you want to fetch the first cart
    res.render('customer/cart.ejs', { 
        cartItems: cart.items,
        total:cart.total, 
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
    // Fetch all products from the database
    res.render('customer/deshbord.ejs', { user });
}); 

router.get('/product/:id',async(req,res)=>{
    const userId = req.params.id;
    // Fetch all products from the database
    const allproducts = await Product.find({});
    // console.log(allproducts);
    res.render('customer/product.ejs', { allproducts, userId});
});


router.get('/',(req,res)=>{
    res.render('customer/index.ejs');
});

module.exports = router;