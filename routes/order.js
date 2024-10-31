const express = require("express");
const router = express.Router();
const db = require("./db.js");
const multer = require("multer"); // For file upload

// Set up storage for uploaded files (Call function below in const upload)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Destination Folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to Date now only (ps. renaming to orderID require too much steps)
    },
});

// Use object upload to call file functions
const upload = multer({ storage: storage });

// Checkout page
router.post("/checkout", upload.single("reciept"), (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" }); // 401 = unauthorized
    }

    const userID = req.session.user.userID;
    const { totalAmount, addressID, cartItems } = req.body;
    const receiptPath = req.file ? req.file.path : null; // Get the path of the uploaded image (if uploaded if not then null)

    // 1: Create a new entry in the orderDetails
    const insertSQL =
        "INSERT INTO orderDetails (total, addressID, userID) VALUES (?, ?, ?)";
    db.query(insertSQL, [totalAmount, addressID, userID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Database errror while inserting into orderDetails",
            });
        }

        const orderID = results.insertId; // InsertID is a value returned from INSERT query when you auto-increment PK
        // TODO:
        // 2. Copy cart into orderItems
        // 3. Update Product Stock
        // 4. Delete Cart
        // 5. Create new orderStatusHistory
        // 6. Create new Payment with file
    });
});
module.exports = router;
