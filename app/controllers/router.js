"use strict";

const express = require("express");
const router = express.Router();
const productRouter = require("./../routes/products");
const adminProductRouter = require("./../routes/admin_products");
const path = require("path");

router.use("/products", productRouter);
router.use("/admin/products", validateAdmin, adminProductRouter);
router.use(express.static("public"));

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});

router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});

router.get('/shopping_cart', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'shopping_cart.html'));
});

function validateAdmin(req, res, next) {
  let adminToken = req.get('x-auth');
  if (adminToken == undefined || adminToken != 'admin') {
    res.status(403).send('Unauthorized');
  } else {
    next();
  }
}

module.exports = router;