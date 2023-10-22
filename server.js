"use strict";

const fs = require("fs");
const express = require("express");
const router = require("./app/controllers/router")
const Product = require("./app/controllers/product");
const data_handler = require("./app/controllers/data_handler");

const app = express();
const port = 3000;
console.table(Product)

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Practica 3 app listening on port ${port}`);
});

