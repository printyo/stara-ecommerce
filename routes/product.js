const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Get all products in browse page including filter.
router.get("/products", (req, res) => {
    const category = req.query.category; //the fetch caller is /product?category=${categoryID} so this grabs the value of category used query because it is optional, does not require like params that is used for required parameters.
    let sql =
        "SELECT product.* , category.name as categoryName FROM product JOIN category ON product.categoryID = category.categoryID";

    // category exists and is not 0: 0 means show all category
    if (category && category != "0") {
        sql += ` WHERE category.categoryID = ${Number(category)}`; //Number() changes string to number (similar to parse)
    } //check if category exists and is 0 which means All, then add filter

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err); // output error message
            return res.status(500).json({ error: "Database query error" }); // Internal Server Error (basically something is wrong with the database)
        }
        res.json(results);
    });
});

// Get all category
router.get("/category", (req, res) => {
    const sql = "SELECT * FROM category";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err); // output error message
            return res.status(500).json({ error: "Database query error" }); // Internal Server Error (basically something is wrong with the database)
        }
        res.json(results);
    });
});

// Get single Product to Product Page
router.get("/product/:id", (req, res) => {
    const productID = req.params.id;
    const sql =
        "SELECT product.*, category.name AS categoryName, category.description AS categoryDescription FROM product JOIN category ON product.categoryID = category.ID WHERE product.ID = ?";
    db.query(sql, [productID], (err, results) => {
        if (err) {
            console.error(error);
            return res.status(500).json({ error: "Database query error" }); // 500 Internal Server Error
        }
        if (results.length > 0) {
            // Make sure that it returns data
            res.json(results[0]);
        } else {
            res.status(404).send("Product not found"); // 404 = Not Found
        }
    });
});

module.exports = router;
