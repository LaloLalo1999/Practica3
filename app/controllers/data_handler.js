"use strict";

const fs = require('fs')
const Product = require('./product');

// Leer el contenido de users.json
// Parsear y convertir a User el contenido de products.json
let content = fs.readFileSync('./app/data/products.json');

// let products = JSON.parse(content).map(Product.createFromObject);
let products = [];
let productsJSON = JSON.parse(content);

for (let product of productsJSON) {
  if (product.uuid === undefined || product.uuid === "") {
    products.push(Product.createFromObject(product));
  } else {
    try {
      products.push(Product.createFromObject(product, product.uuid));
    } catch (e) {
      console.log(e.errorMessage);
    }
  }
}

storeProductsJson(products);

function storeProductsJson(products) {
  newProducts = []
  for (let product of products) {
    const newProduct = Object.entries(product).reduce((product, [key, value]) => {
      product[key.substring(1)] = value;
      return product;
    }, {});
    newProducts.push(newProduct);
  }
  fs.writeFileSync('./app/data/products.json', JSON.stringify(newProducts, null, 2));
}

function getProducts() {
  return products;
}

function getProductById(uuid) {
  return products.find((product) => product.uuid === uuid);
}

function createProduct(product) {
  if (typeof product !== "object") {
    throw new ProductException("Product must be an object.");
  }
  if (product.uuid) {
    if (getProductById(product.uuid)) {
      throw new ProductException("Product already exists.");
    } else {
      uuid = product.uuid;
    }
    
  }
  products.push(Product.createFromObject(product));
  storeProductsJson(products);
}

function updateProduct(uuid, updatedProduct) {
  const productIndex = products.findIndex((product) => product.uuid === uuid);
  if (productIndex === -1) {
    throw new ProductException("Product not found.");
  }
  products[productIndex] = Product.createFromObject(updatedProduct);
  storeProductsJson(products);
}

function deleteProduct(uuid) {
  const productIndex = products.findIndex((product) => product.uuid === uuid);
  if (productIndex === -1) {
    throw new ProductException("Product not found.");
  }
  products.splice(productIndex, 1);
  storeProductsJson(products);
}

function findProduct(query) {
  // query is a string formatted as "<category>:<title>". If the user only enters a category, return all products in that category. If the user only enters a title, return all products with that title. If the user enters both a category and a title, return all products in that category with that title.
  if (typeof query !== "string") {
    throw new ProductException("Query must be a string.");
  }
  if (!query.includes(":")) {
    return products.filter((product) => product.title === query);
  }
  const [category, title] = query.split(":");
  if (category && title) {
    return products.filter((product) => product.category === category && product.title === title);
  }
  if (category) {
    return products.filter((product) => product.category === category);
  }
  if (title) {
    return products.filter((product) => product.title === title);
  }
}

exports.storeProductsJson = storeProductsJson;
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.findProduct = findProduct;