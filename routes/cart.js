const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Adding product into cart (Product Page)
router.post("/cart", (req, res) => {
    const productID = req.body.productID;
    const userID = req.session.user.userID; // Get user ID from session

    const checkSql = "SELECT * FROM cart WHERE userID = ? AND productID = ?";
    db.query(checkSql, [userID, productID], (err, results) => {
        if (err) {
            console.error(error);
            res.status(500).json({ error: "Database query error" }); // 500 = Internal Server Error
        }

        if (results.length > 0) {
            // Check if that user has that specific item in the cart
            const newQuantity = results[0].quantity + 1;
            const updateSql =
                "UPDATE cart SET quantity = ? WHERE userID = ? AND productID = ?";
            db.query(updateSql, [newQuantity, userID, productID], (err) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ error: "Error updating cart" }); // 500 = Internal Server Error
                }
                res.status(200).json({ message: "Cart updated successfully" });
            });
        } else {
            // User doesn't have this product in the cart so we INSERT
            const insertSql =
                "INSERT INTO cart (userID, productID) VALUES (?, ?)";
            db.query(insertSql, [userID, productID], (err) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ error: "Error adding to cart" }); // 500 = Internal Server Error
                }
                res.status(201).json({ message: "Item added to cart" }); // 201 = Created
            });
        }
    });
});

// Geting user's cart  (in the Cart Page and Checkout Page)
router.get("/cart", (req, res) => {
    const userID = req.session.user.userID; // Get user ID from session

    const sql =
        "SELECT cart.*, product.name, product.price FROM cart JOIN product ON cart.productID = product.productID WHERE cart.userID = ?";

    db.query(sql, [userID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database query error" }); // 500 = Internal Server Error
        }
        res.json(results);
    });
});

// Deleting Item in the Cart (Cart Page)
router.delete("/cart/:productID", (req, res) => {
    const productID = req.params.productID;
    const userID = req.session.user.userID; // Get user ID from session

    const deleteSql = "DELETE FROM cart WHERE userID = ? AND productID = ?";
    db.query(deleteSql, [userID, productID], (err) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .json({ error: "Error deleting item from cart" }); // 500 = Internal Server Error
        }
        res.status(200).json({ message: "Item removed from cart" }); // 200 = OK (success)
    });
});

module.exports = router;
