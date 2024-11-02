const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Get Order Details w/ Payment image (ALL orders - admin privileges) (maybe get only status that isn't 6=payment failed)
router.get("/admin/orders", (req, res) => {
    // if (!req.session.user || req.session.user.role != 2) {
    //     return res.status(403).json({ error: "User doesn't have permission" }); // 403 = Forbidden
    // }

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

// POST devChat (only allow role = 2 or 3)
// GET all devChat (only allow role = 2 or 3)

// POST new Product

// GET Product Information When searched via name
// PATCH PRODUCT INFORMATION

// DELETE PRODUCT VIA NAME

// GET ALL USERS (CUSTOMER ONLY)
// PATCH UPDATE ROLE = 2

// GET ALL USERS (ADMIN ONLY)
// PATCH UPDATE ROLE = 3
module.exports = router;
