const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Handle signup
router.post("/signup", (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const sql =
        "INSERT INTO user (firstName, lastName, email, password, phoneNumber) VALUES (?, ?, ?, ?, ?)";
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

    const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
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

    const userID = req.session.user.userID;

    const sql = "SELECT role FROM user WHERE userID = ?";
    db.query(sql, [userID], (err, results) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .json({ error: "Database error while retrieving role" });
        }
        const role = results[0].role;
        let roleName = null;
        if (role == 1) {
            roleName = "Customer";
        } else if (role == 2) {
            roleName = "Admin";
        } else {
            roleName = "Developer";
        }
        res.status(200).json({ role: role, roleName: roleName });
    });
});

// Display user infomration (Account Page)
router.get("/user", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" }); // 401 = unauthorized
    }

    const userID = req.session.user.userID;

    const sql = "SELECT * FROM user WHERE userID = ?";

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

// Display all addresses from user (account Page)

// Add new Address for User (Account Page)

// Delete address  for User (Account Page)

module.exports = router;
