const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Adding product into cart (Product Page)
router.post("/cart", (req, res) => {
    const productID = req.body.productID;
    const userID = req.session.user.userID; // Get user ID from session

    const checkSql = "SELECT * FROM cart WHERE userID = ? AND productID = ?";
    db.query(checkSql, [userID, productID], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // Check if that user has that specific item in the cart
            const newQuantity = results[0].quantity + 1;
            const updateSql =
                "UPDATE cart SET quantity = ? WHERE userID = ? AND productID = ?";
            db.query(updateSql, [newQuantity, userID, productID], (err) => {
                if (err) throw err;
                res.status(200).send("Cart updated");
            });
        } else {
            // User doesn't have this product in the cart so we INSERT
            const insertSql =
                "INSERT INTO cart (userID, productID, quantity) VALUES (?, ?, ?)";
            db.query(insertSql, [userID, productID, quantity], (err) => {
                if (err) throw err;
                res.status(201).send("Item added to cart");
            });
        }
    });
});

// Geting cart products (in the Cart Page)
router.get("/cart", (req, res) => {
    const userID = req.session.user.userID; // Get user ID from session

    const sql =
        "SELECT cart.*, product.name, product.price FROM cart JOIN product ON cart.productID = product.productID WHERE cart.userID = ?";

    db.query(sql, [userID], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Deleting Item in the Cart (Cart Page)
router.delete("/cart/:productID", (req, res) => {
    const productID = req.params.productID;
    const userID = req.session.user.userID; // Get user ID from session

    const deleteSql = "DELETE FROM cart WHERE userID = ? AND productID = ?";
    db.query(deleteSql, [userID, productID], (err) => {
        if (err) throw err;
        res.send("Item removed from cart");
    });
});

module.exports = router;
