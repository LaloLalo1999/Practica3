"use strict";

const express = require("express");
const router = express.Router();
const dataHandler = require('./../controllers/data_handler');

// Get all products loaded on the products array if no filter is provided.
// Get the product loaded on the products array if a filter is provided.
// query is a string formatted as "<category>:<title>". If the user only enters a category, return all products in that category. If the user only enters a title, return all products with that title. If the user enters both a category and a title, return all products in that category with that title.
router.route('/')
  .get((req, res) => {
    let query = req.query.filter;
    let products;
    if (query === undefined) {
      try {
        products = dataHandler.getProducts();
        res.json(products);
      } catch (e) {
        res.status(400).send("Error: " + e);
      }
    } else {
      products = dataHandler.findProduct(query);
      res.json(products);
    }
  });

  //
router.route('/cart')
  .post((req, res) => {
    let proxies = req.body;
    let products = [];

    if (!Array.isArray(proxies)) {
      res.status(400).send("Proxies must be an array.");
    }

    for (let proxy of proxies) {
      let product = dataHandler.getProductById(proxy.Uuid);
      if (product === undefined) {
        res.status(400).send("Product not found.");
      }
      products.push(product);
    }
    res.json(products)
  })

router.route('/:id')
  .get((req, res) => {
    
  })

module.exports = router;