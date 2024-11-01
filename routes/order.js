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

        // 2. Copy cart into orderItems
        const orderItems = cartItems.map((item) => [
            // Map transform array into new array / forEach executes on each item but does not create new array
            orderID,
            item.productID,
            item.stock,
        ]);
        // Eg.
        // [
        //     { productID: 1, quantity: 2 },
        //     { productID: 2, quantity: 1 }
        // ]
        // will turn to
        // [
        //     [13, 1, 2],
        //     [13, 2, 1]
        // ]

        const insertSQLorderItems =
            "INSERT INTO orderItems (orderID, productID, quantity) VALUES ?";
        db.query(insertSQLorderItems, orderItems, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Database error while inserting into orderItems",
                });
            }

            // 3. Update Product Stock
            const updateStock = orderItems.map((item) => {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
                return new Promise((resolve, reject) => {
                    const updateSQLstock =
                        "UPDATE products SET stock = stock - ? WHERE productID = ?";

                    db.query(updateSQLstock, [item[2], item[1]], (err) => {
                        // item[2] = stock, item[1] = productID, item[0] = orderID (we don't use)
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                    });
                });
            });

            // Promise.all()
            // Takes an iterable of promises as input and returns a single Promise.
            // This returned promise fulfills when all of the input's promises fulfill (including when an empty iterable is passed),
            // with an array of the fulfillment values. It rejects when any of the input's promises reject, with this first rejection reason.
            Promise.all(updateStock)
                .then(() => {
                    // Check if completed all update

                    // 4. Delete Cart
                    const deleteSQLcart = "DELETE FROM cart WHERE userID = ?";
                    db.query(deleteSQLcart, [userID], (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                error: "Database error while deleting cart",
                            });
                        }

                        // 5. Create new orderStatusHistory
                        const insertSQLstatus =
                            "INSERT INTO orderStatusHistory (orderID) VALUES (?)";

                        db.query(insertSQLstatus, [orderID], (err, results) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({
                                    error: "Database error while inserting into orderStatusHistory",
                                });
                            }

                            // 6. Create new Payment with file
                            const insertSQLpayment =
                                "INSERT INTO payment (fileURL, orderID) VALUES (?, ?)";
                            db.query(
                                insertSQLpayment,
                                [receiptPath, orderID],
                                (err, results) => {
                                    if (err) {
                                        console.error(err);
                                        return res.status(500).json({
                                            error: "Database error while inserting into payment",
                                        });
                                    }
                                    res.status(201).json({
                                        message:
                                            "Order have been placed successfully",
                                    });
                                }
                            );
                        });
                    });
                })
                .catch((err) => {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ error: "Failed to update product quantities" });
                });
        });
    });
});
module.exports = router;
