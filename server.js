const express = require("express");
const bodyParser = require("body-parser"); // For sending data between server and html
const mysql = require("mysql2");
const session = require("express-session"); // For session management
const multer = require("multer"); // For file upload

// Import routes
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");

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

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
    },
});

const upload = multer({ storage: storage });

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Landing page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html"); // Need to send a file to user, __dirname is a univseral variable to find the directory of this app
});

// Using Routes
app.use(userRoutes); // Add user routes
app.use(productRoutes); // Add product routes
app.use(cartRoutes); // Ad cart routes
app.use(orderRoutes); // Add cart routes

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
