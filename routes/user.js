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
            if (err) throw err;
            res.redirect("/login.html"); // Redirect to login page after successful signup
        }
    );
});

// Handle login
router.post("/login", (req, res) => {
    delete req.session.user;
    const { email, password } = req.body;
    const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            // Save user data to local storage (simulated with session for this example)
            req.session.user = results[0];
            res.redirect("/home.html");
        } else {
            res.send("Invalid email or password");
        }
    });
});

// Handle login for Guest
router.post("/login-guest", (req, res) => {
    delete req.session.user;
    res.redirect("/home.html");
});

module.exports = router;
