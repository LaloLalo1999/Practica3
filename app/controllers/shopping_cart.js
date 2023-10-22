"use strict";

const dataHandler = require("./../controllers/data_handler");

class ShoppingCartException {
  constructor(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

class CartItem {
  constructor(productUuid, amount) {
    this.productUuid = productUuid;
    this.amount = amount;
  }
}

class ShoppingCart {
  constructor() {
    this.actualProducts = [];
    this.cartItems = [];
  }

  get products() {
    return this._actualProducts;
  }

  set products(value) {
    this._actualProducts = [];
    // empty array -> create
    if (value.length === 0) {
      return;
    }
    // if type string -> parse JSON
    if (typeof value === "string") {
      value = JSON.parse(value);
    }
    // array -> for and create
    for (let item in value) {
      this._actualProducts.push(Product.createFromObject(item));
    }
    //if single element -> create
    this._actualProducts.push(Product.createFromObject(value));
  }

  get cartItems() {
    return this._cartItems;
  }

  set cartItems(value) {
    if (Array.isArray(value) && value.length === 0) {
      this._cartItems = [];
      return;
    }
    throw new ShoppingCartException("Cannot modify directly, use correct methods.");
  }

  addItem(productUuid, amount) {
    if (typeof productUuid !== "string") {
      throw new ShoppingCartException("Product UUID must be a string.");
    }
    if (typeof amount !== "number") {
      throw new ShoppingCartException("Amount must be a number.");
    }
    if (amount <= 0 || amount % 1 !== 0) {
      throw new ShoppingCartException("Amount must be a positive whole number.");
    }

    const existingProductIndex = this.cartItems.findIndex((product) => product.productUuid === productUuid);
    
    // Find the actual product object by its UUID
    const actualProduct = dataHandler.getProductById(productUuid);
    if (!actualProduct) {
      throw new ShoppingCartException("Product not found.");
    }

    // Create a copy of the actual product
    const productCopy = Product.createFromObject(actualProduct, productUuid);

    if (existingProductIndex !== -1) {
      // if exists, add amount to existing item
      this.cartItems[existingProductIndex].amount += amount;
    } else {
      // if doesn't exist, add new item
      this.cartItems.push(new CartItem(productUuid, amount));
      this._actualProducts.push(productCopy);  // Add a copy of the actual product
    }
  }


  updateItem(productUuid, newAmount) {
    // This function should update the amount of an item in the shopping cart to the new amount. If the new amount is invalid, throw an error. If the new amount is 0, remove the item from the shopping cart. Otherwise, update the amount of the item in the shopping cart.
    if (typeof productUuid !== "string") {
      throw new ShoppingCartException("Product UUID must be a string.");
    }
    if (typeof newAmount !== "number") {
      throw new ShoppingCartException("Amount must be a number.");
    }
    if (newAmount < 0 || newAmount % 1 !== 0) {
      throw new ShoppingCartException("Amount must be a positive whole number.");
    }
    if (newAmount == 0) this.removeItem(productUuid);

    // find -> update existing or throw error if not found
    const productIndex = this.cartItems.findIndex(
      (product) => product.productUuid === productUuid
    );
    if (productIndex === -1) {
      throw new ShoppingCartException("Product not found.");
    } else {
      this.cartItems[productIndex].amount = newAmount;
    }
  }

  removeItem(productUuid) {
    // find -> remove existing or throw error if not found
    const cartItemIndex = this.cartItems.findIndex(
      (product) => product.productUuid === productUuid
    );
    if (cartItemIndex === -1) {
      throw new ShoppingCartException("Product not found.");
    } else {
      this.cartItems.splice(cartItemIndex, 1);
    }

    // Remove the corresponding product copy from _products array
    const productIndex = this._actualProducts.findIndex(
      (product) => product.uuid === productUuid
    );
    if (productIndex !== -1) {
      this._actualProducts.splice(productIndex, 1);
    }
  }

  calculateTotal() {
    let total = 0;
    // for products / proxies -> total += product.pricePerUnit * amount
    for (let i = 0; i < this.products.length; i++) {
      total += this.products[i].pricePerUnit * this.cartItems[i].amount;
    }
    return total;
  }
}
