"use strict";

class ShoppingCartException {
  constructor(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

class ProductProxy {
  constructor(productUuid, amount) {
    this.productUuid = productUuid;
    this.amount = amount;
  }
}

class ShoppingCart {
  constructor() {
    this.products = [];
    this.productProxies = [];
  }

  get products() {
    return this._products;
  }

  set products(value) {
    this._products = [];
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
      this.products.push(Product.createFromObject(item));
    }
    //if single element -> create
    this.products.push(Product.createFromObject(value));
  }

  get productProxies() {
    return this._productProxies;
  }

  set productProxies(value) {
    if (Array.isArray(value) && value.length === 0) {
      this._productProxies = [];
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

    const existingProductIndex = this.productProxies.findIndex((product) => product.productUuid === productUuid);
    
    // Find the actual product object by its UUID
    const actualProduct = getProductById(productUuid);
    if (!actualProduct) {
      throw new ShoppingCartException("Product not found.");
    }

    // Create a copy of the actual product
    const productCopy = Product.createFromObject(actualProduct, productUuid);

    if (existingProductIndex !== -1) {
      // if exists, add amount to existing item
      this.productProxies[existingProductIndex].amount += amount;
    } else {
      // if doesn't exist, add new item
      this.productProxies.push(new ProductProxy(productUuid, amount));
      this._products.push(productCopy);  // Add a copy of the actual product
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
    const productIndex = this.productProxies.findIndex(
      (product) => product.productUuid === productUuid
    );
    if (productIndex === -1) {
      throw new ShoppingCartException("Product not found.");
    } else {
      this.productProxies[productIndex].amount = newAmount;
    }
  }

  removeItem(productUuid) {
    // find -> remove existing or throw error if not found
    const productProxyIndex = this.productProxies.findIndex(
      (product) => product.productUuid === productUuid
    );
    if (productProxyIndex === -1) {
      throw new ShoppingCartException("Product not found.");
    } else {
      this.productProxies.splice(productProxyIndex, 1);
    }

    // Remove the corresponding product copy from _products array
    const productIndex = this._products.findIndex(
      (product) => product.uuid === productUuid
    );
    if (productIndex !== -1) {
      this._products.splice(productIndex, 1);
    }
  }

  calculateTotal() {
    let total = 0;
    // for products / proxies -> total += product.pricePerUnit * amount
    for (let i = 0; i < this.products.length; i++) {
      total += this.products[i].pricePerUnit * this.productProxies[i].amount;
    }
    return total;
  }
}
