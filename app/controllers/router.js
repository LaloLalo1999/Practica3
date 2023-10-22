"use strict";

const express = require("express");
const router = express.Router();
const productRouter = require("./../routes/products");
const adminProductRouter = require("./../routes/admin_products");

router.use("/products", productRouter);

router.get('/', (req, res) => {
  res.send('E-Commerce app Practica 3');
});

module.exports = router;