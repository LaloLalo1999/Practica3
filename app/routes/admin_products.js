"use strict";

const express = require("express");
const router = express.Router();
const dataHandler = require('../controllers/data_handler');
const Product = require('../controllers/product');


router.route('/')
  .post((req, res) => {
    let product = req.body;
    try {
      dataHandler.createProduct(product);
    } catch (e) {
      res.status(400).send("Error: " + e);
    }
    res.send("Product created.");
  });

router.route("/:id")
  .put((req, res) => {
    let uuid = req.params.id;
    let product = req.body;

    try {
      dataHandler.updateProduct(uuid, product);
    } catch (e) {
      res.status(400).send("Error: " + e);
    }
    res.send("Product updated.");
  })
  .delete((req, res) => {
    let uuid = req.params.id;
    try {
      dataHandler.deleteProduct(uuid);
    } catch (e) {
      res.status(400).send("Error: " + e);
    }
    res.send("Product deleted.");
  });



module.exports = router;