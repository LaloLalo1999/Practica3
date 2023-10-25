"use strict";

const express = require("express");
const router = express.Router();
const productRouter = require("./../routes/products");
const adminProductRouter = require("./../routes/admin_products");

router.use("/products", productRouter);
router.use("/admin/products", validateAdmin, adminProductRouter);

router.get('/', (req, res) => {
  res.send('E-Commerce app Practica 3');
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