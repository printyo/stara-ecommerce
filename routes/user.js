const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Handle signup
router.post("/signup", (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const sql =
        "INSERT INTO user (firstName, lastName, email, password, phoneNumber) VALUES (?, ?, ?, AES_ENCRYPT(?, 'lovelove'), ?)";
    db.query(
        sql,
        [firstName, lastName, email, password, phoneNumber],
        (err, result) => {
            if (err) {
                console.error(err); //output error message
                return res.status(500).json({ error: "Signup failed" }); // 500 = Internal Server Error
            }
            res.status(302).redirect("/login.html"); // Redirect to login page after successful signup 302 = Found
        }
    );
});

// Handle login
router.post("/login", (req, res) => {
    if (req.session.user) delete req.session.user;
    const { email, password } = req.body;

    // Check if there are both email and password
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    const sql =
        "SELECT userID, firstName, lastName, email, role, phoneNumber  FROM user WHERE email = ? AND password = AES_ENCRYPT(?, 'lovelove')";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error(err); //output error message
            return res.status(500).json({ error: "Login failed" });
        }
        if (results.length > 0) {
            // Save user data to local storage (simulated with session for this example)
            req.session.user = results[0];
            res.status(302).redirect("/home.html"); // 302 = Found
        } else {
            res.status(401).send("Invalid email or password"); // 401 = Unauthorized
        }
    });
});

// Handle login for Guest
router.post("/login-guest", (req, res) => {
    if (req.session.user) delete req.session.user; // Remove any existing users
    res.status(302).redirect("/home.html"); // 302 = Found
});

// Check user role (To check if user has logged in and what role, so we can change how they have access to the website)
router.get("/checkrole", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" }); // 401 = unauthorized
    }

    const role = req.session.user.role;

    let roleName;
    if (role == 1) {
        roleName = "Customer";
    } else if (role == 2) {
        roleName = "Admin";
    } else {
        roleName = "Developer";
    }
    res.status(200).json({ role: role, roleName: roleName });
});

// Log Out Button (call this when u log out)
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error logging out" });
        }
        res.status(200).json({ message: "Successfully logged out" });
    });
});

// Display user information (Account Page)
router.get("/user", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" }); // 401 = unauthorized
    }

    res.json(req.session.user);
});

// Display all addresses from user (Account Page and Checkout Page)
router.get("/user/addresses", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" }); // 401 = unauthorized
    }

    const userID = req.session.user.userID;

    const sql = "SELECT * FROM useraddress WHERE userID = ? AND isActive = 1";

    db.query(sql, [userID], (err, results) => {
        if (err) {
            console.error(error);
            return res
                .status(500)
                .json({ error: "Database error while finding user" });
        }
        res.json(results);
    });
});

// Add new Address for User (Account Page)
router.post("/user/address", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" }); // 401 = unauthorized
    }

    const userID = req.session.user.userID;
    const { addressLine1, addressLine2, postcode, city, phoneNumber } =
        req.body;

    const sql =
        "INSERT INTO userAddress (addressLine1, addressLine2, postcode, city, phoneNumber, userID) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
        sql,
        [addressLine1, addressLine2, postcode, city, phoneNumber, userID],
        (err, results) => {
            if (err) {
                console.error(err); //output error message
                return res
                    .status(500)
                    .json({ error: "Database error while inserting address" });
            }
            res.status(201).json({ message: "Address added successfully" }); // 201 = Created
        }
    );
});

// Delete address  for User (Account Page) We do not delete the address because some orders may still require it
router.patch("/user/address/:id", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" }); // 401 = unauthorized
    }

    const userID = req.session.user.userID;
    const addressID = req.params.id;

    // userID is not necessary but it is just another security measure
    const sql =
        "UPDATE userAddress SET isActive = 0 WHERE addressID = ? AND userID = ?";
    db.query(sql, [addressID, userID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Database error in updating isActive for userAddress",
            }); // 500 = Internal Server Error
        }

        if (results.affectedRows > 0) {
            res.status(200).json({ message: "userAddress has been removed" });
        } else {
            res.status(404).json({
                message:
                    "Address not found or Address already inActive or UserID and AddressID doesn't match",
            });
        }
    });
});

module.exports = router;
