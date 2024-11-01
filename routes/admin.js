const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Get Order Details w/ Payment image (ALL orders - admin privileges) (maybe get only status that isn't 6=payment failed)
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
