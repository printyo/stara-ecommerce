const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Get all products in browse page including filter.
router.get("/products", (req, res) => {
    const category = req.query.category; //the fetch caller is /product?category=${categoryID} so this grabs the value of category
    let sql =
        "SELECT product.* , category.name as categoryName FROM product JOIN category ON product.categoryID = category.categoryID";

    if (category && category != "0") {
        sql += ` WHERE category.categoryID = ${Number(category)}`;
    } //check if category exists and is 0 which means All, then add filter

    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get all category
router.get("/category", (req, res) => {
    const sql = "SELECT * FROM category";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get single Product to Product Page
router.get("/product/:id", (req, res) => {
    const productID = req.params.id;
    const sql =
        "SELECT product.*, category.name AS categoryName, category.description AS categoryDescription FROM product JOIN category ON product.categoryID = category.ID WHERE product.ID = ?";
    db.query(sql, [productID], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            // Make sure that it returns data
            res.json(results[0]);
        } else {
            res.status(404).send("Product not found");
        }
    });
});

module.exports = router;
