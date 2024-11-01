const express = require("express");
const bodyParser = require("body-parser"); // For sending data between server and html
const mysql = require("mysql2");
const session = require("express-session"); // For session management

// Import routes
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const adminRoutes = require("./routes/admin.js");

const app = express();
const port = 3000;

const db = require("./routes/db");

// Middleware (need to send information back and forth from server.js to where you fetch data)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from 'public' directory (tell express where to get files)

// Session middleware (express-session (keeps cookies and info during whole session))
app.use(
    session({
        secret: "keyboard cat", // Copied from documentation
        resave: false,
        saveUninitialized: true,
    })
);

// Landing page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html"); // Need to send a file to user, __dirname is a univseral variable to find the directory of this app
});

// Using Routes
app.use(userRoutes); // Add user routes
app.use(productRoutes); // Add product routes
app.use(cartRoutes); // Ad cart routes
app.use(orderRoutes); // Add order routes
app.use(adminRoutes); // Add admin routes

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
