const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Checkout page
router.post("/checkout", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" }); // 401 = unauthorized
    }

    const userID = req.session.user.userID;
    const { totalAmount, addressID, cartItems } = req.body;

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

        const orderID = results.orderID;
        // 2. Copy cart into orderItems
        // 3. Update Product Stock
        // 4. Delete Cart
        // 5. Create new orderStatusHistory
        // 6. Create new Payment with file
    });
});
module.exports = router;
