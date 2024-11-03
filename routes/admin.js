const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Get Order Details w/ Payment image (ALL orders - admin privileges) (maybe get only status that isn't 6=payment failed)
router.get("/admin/orders", (req, res) => {
    if (!req.session.user || req.session.user.role != 2) {
        return res.status(403).json({ error: "User doesn't have permission" }); // 403 = Forbidden
    }

    // Join 4 tables - orderDetails, Payment, userAddress, (and a modified orderStatusHistory that gets the highest value of status)
    const sql = `SELECT o.*, p.fileURL, ad.*  
        FROM orderDetails AS o JOIN payment AS p 
        ON o.orderID = p.orderID 
        JOIN userAddress as ad 
        ON o.addressID = ad.addressID 
        JOIN (
            SELECT orderID, status FROM orderStatusHistory 
            WHERE (orderID, status) IN (SELECT orderID, MAX(status) 
            FROM orderStatusHistory GROUP BY orderID) 
        ) 
        AS osh ON o.orderID = osh.orderID WHERE osh.status != 6`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .json({ error: "Database error while selecting orders" });
        }

        res.json(results);
    });
});

// Get Order Items (reuse? from order.js?)
// Get Order Status History (reuse? from order.js?)

// POST orderStatusHistory
router.post("/admin/status", (req, res) => {
    if (!req.session.user || req.session.user.role != 2) {
        return res.status(403).json({ error: "User doesn't have permission" }); // 403 = Forbidden
    }

    const { orderID, status, remark } = req.body;

    const insertSql =
        "INSERT INTO orderStatusHistory (status, remark, orderID) VALUES (?, ?, ?)";
    db.query(insertSql, [orderID, status, remark], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Database error while inserting into orderStatusHistory",
            });
        }
        res.status(201).json({ message: "Order status updated successfully." }); // 201 = Created
    });
});

// POST devChat (only allow role = 2 or 3)
router.post("/admindev/chat", (req, res) => {
    if (!req.session.user || req.session.user.role == 1) {
        return res.status(403).json({ error: "User doesn't have permission" }); // 403 = Forbidden
    }

    const userID = req.session.user.userID;
    const chat = req.body.chat;

    sql = "INSERT INTO devChat (chat, userID) VALUE (?, ?)";
    db.query(sql, [chat, userID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Database error while inserting into devChat",
            });
        }
        res.status(201).json({ message: "Chat added successfully" }); // 201 = Created
    });
});

// GET all devChat (only allow role = 2 or 3)
router.get("/admindev/chat", (req, res) => {
    if (!req.session.user || req.session.user.role == 1) {
        return res.status(403).json({ error: "User doesn't have permission" }); // 403 = Forbidden
    }

    sql = "SELECT * FROM devChat";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Database error while selecting from devChat",
            });
        }
        res.json(results);
    });
});

// POST new Product
router.post("/admin/product/add", (req, res) => {
    if (!req.session.user || req.session.user.role != 2) {
        return res.status(403).json({ error: "User doesn't have permission" }); // 403 = Forbidden
    }

    const { name, description, stock, price, imageURL, categoryID } = req.body;
    //Fetch categoryID using same method as browse page.
    const sql =
        "INSERT INTO product (name, description, stock, price, imageURL, categoryID) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
        sql,
        [name, description, stock, price, imageURL, categoryID],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Database error while inserting into products",
                });
            }
            res.status(201).json({ message: "Product added successfully" });
        }
    );
});

// GET Product Information When searched via name
router.get("/admin/product/get", (req, res) => {
    if (!req.session.user || req.session.user.role != 2) {
        return res.status(403).json({ error: "User doesn't have permission" }); // 403 = Forbidden
    }

    const productName = req.body.productName;

    const sql = "SELECT * FROM product WHERE name LIKE ?";
    db.query(sql, [`%${productName}%`], (err, results) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .json({ error: "Database error while selecting products" });
        }

        res.json(results[0]);
    });
});

// PATCH PRODUCT INFORMATION
router.patch("/admin/product/patch", (req, res) => {
    if (!req.session.user || req.session.user.role != 2) {
        return res.status(403).json({ error: "User doesn't have permission" }); // 403 = Forbidden
    }

    const { productID, name, description, stock, price, imageURL, categoryID } =
        req.body;

    const sql =
        "UPDATE product SET name = ?, description = ?, stock = ?, price = ?, imageURL = ?, categoryID = ? WHERE productID = ?";
    db.query(
        sql,
        [name, description, stock, price, imageURL, categoryID, productID],
        (err, results) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ error: "Database error while updating products" });
            }

            res.status(200).json({
                message: "Update Product Information Successfully",
            });
        }
    );
});

// DELETE PRODUCT VIA NAME
// TODO:

// GET ALL USERS (CUSTOMER ONLY)
router.get("/admin/users/customer", (req, res) => {
    if (!req.session.user || req.session.user.role != 2) {
        return res.status(403).json({ error: "User doesn't have permission" }); // 403 = Forbidden
    }

    const sql = "SELECT * FROM user WHERE ROLE = 1";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .json({ error: "Database error while selecting users" });
        }

        res.json(results);
    });
});

// PATCH UPDATE ROLE = 2

// GET ALL USERS (ADMIN ONLY)

// PATCH UPDATE ROLE = 3
module.exports = router;
