
Visit :- https://hardhub.onrender.com

# JOY Hardware Solutions - E-Commerce Platform

A full-featured e-commerce platform for hardware solutions built with Node.js, Express, and MongoDB. The platform supports both customer/buyer and seller/admin functionalities.

## 🌟 Features

### Customer Side (Buyer)
- **User Authentication**: Secure login and registration system
- **Product Browsing**: View all available hardware products with filters
- **Shopping Cart**: Add/remove products and manage quantities
- **Checkout**: Complete order placement with shipping details
- **Payment Integration**: Secure payment processing
- **Order Tracking**: View order details and history
- **User Dashboard**: Manage profile, orders, and account settings
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin/Seller Side
- **Dashboard**: Overview of sales, orders, products, and inventory
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **Sales Analytics**: Track total sales, orders, and products
- **Inventory Tracking**: Monitor low stock items
- **Seller Profile**: Manage seller information

### General Features
- **Secure Authentication**: JWT-based token authentication with HTTP-only cookies
- **Cookie Management**: Secure cookie handling for production environments
- **Logout Functionality**: Proper session management with confirmation dialogs
- **Responsive Navigation**: Dynamic navbar across all pages
- **Error Handling**: Custom error pages (404, Access Denied)
- **Professional UI**: Modern, clean interface with Tailwind CSS

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Templating**: EJS
- **Environment Variables**: dotenv

### Frontend
- **Templating**: EJS
- **Styling**: CSS, Tailwind CSS
- **Responsive Design**: CSS Media Queries
- **Icons**: Font Awesome 6.7.2
- **JavaScript**: Vanilla JS

### Additional Libraries
- **cookie-parser**: Parse HTTP request cookies
- **uuid**: Generate unique identifiers
- **qs**: Parse nested form data

## 📁 Project Structure

```
JOY_COM/
├── app.js                          # Main application entry point
├── package.json                    # Project dependencies
├── .env                           # Environment variables
├── config/
│   └── db.js                      # MongoDB connection configuration
├── middleware/
│   ├── checkBuyer.js             # Buyer authentication middleware
│   ├── checkSeller.js            # Seller authentication middleware
│   ├── optionalAuth.js           # Optional authentication middleware
│   ├── uplode-image.js           # Image upload middleware
│   └── validation.js             # Form validation middleware
├── models/
│   ├── cart.js                   # Cart schema
│   ├── checkout.js               # Checkout schema
│   ├── Product.js                # Product schema
│   └── users.js                  # User schema
├── routes/
│   ├── authenticationRoutes.js   # Auth routes (login, logout, register)
│   ├── sellerRoutes.js           # Seller/Admin routes
│   └── userRoutes.js             # Buyer/Customer routes
├── public/
│   ├── css/
│   │   ├── Admin/               # Admin dashboard styles
│   │   ├── Authentication/      # Login/signup styles
│   │   ├── customer/            # Customer page styles
│   │   └── error/               # Error page styles
│   ├── image/
│   │   └── Product/             # Product images
│   └── script/
│       ├── Admin/               # Admin side scripts
│       ├── Authentication/      # Auth scripts
│       ├── customer/            # Customer side scripts
│       └── error/               # Error page scripts
└── views/
    ├── Admin/                   # Admin dashboard pages
    ├── Authentication/          # Login and signup pages
    ├── customer/                # Customer/buyer pages
    │   └── partials/            # Reusable components (navbar, etc.)
    └── error/                   # Error pages (404, Access Denied)
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Flags**: Cookies are secure in production (HTTPS only)
- **Password Hashing**: bcrypt with salt rounds
- **CSRF Protection**: SameSite cookie attribute
- **Role-Based Access**: Buyer and Seller specific middleware
- **Cookie Expiration**: 24-hour token expiration

## 🚢 Deployment

### Deploy on Render

1. **Create a Render account** at https://render.com

2. **Set up MongoDB**:
   - Use MongoDB Atlas for cloud database
   - Get your connection string

3. **Configure Environment Variables** in Render:
   - `MONGODB_URI` - Your MongoDB connection string
   - `SECRET_KEY` - JWT secret key
   - `NODE_ENV` - Set to `production`
   - `PORT` - Set to `3000`

4. **Deploy**:
   - Connect your GitHub repository
   - Select Node.js environment
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Deploy

5. **Cookie Settings**: The application automatically uses secure cookie settings in production:
   - `secure: true` (HTTPS only)
   - `httpOnly: true` (JavaScript cannot access)
   - `sameSite: 'Lax'` (CSRF protection)

## 🐛 Troubleshooting

### Logout Not Working
- Ensure `NODE_ENV` is set correctly in production
- Check that secure cookie options match between login and logout
- Clear browser cookies and try again

### MongoDB Connection Error
- Verify MongoDB URI in `.env` file
- Check MongoDB Atlas network access settings
- Ensure firewall allows database connections

### Image Upload Issues
- Check image upload middleware configuration
- Verify image directory has write permissions
- Ensure proper file size limits

## 📝 API Response Format

All API responses follow a consistent format:
- Success: HTTP 200-201 with data
- Client Error: HTTP 400-404 with error message
- Server Error: HTTP 500 with error message

## 🎨 UI Components

### Navbar
- Located in `views/customer/partials/navbar.ejs`
- Included on all customer pages
- Shows cart count, user profile, and navigation links

### Footer
- Consistent footer styling across all pages
- Dark blue gradient background
- Contact information display

### Dashboard Cards
- Sales, orders, products, and stock metrics
- Color-coded status indicators
- Responsive grid layout


## 📄 License

This project is proprietary and all rights are reserved to JOY Hardware Solutions © 2023.
