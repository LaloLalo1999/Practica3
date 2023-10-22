"use strict";

const generateUUID = require("./utils").generateUUID;

class ProductException {
  constructor(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

class Product {
  constructor(title, description, imageUrl, unit, stock, pricePerUnit, category) {
    this._uuid = generateUUID();
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.unit = unit;
    this.stock = stock;
    this.pricePerUnit = pricePerUnit;
    this.category = category;
  }

  get uuid() {
    return this._uuid;
  }

  set uuid(value) {
    throw new ProductException("Cannot change uuid, they're auto-generated.");
  }

  get title() {
    return this._title;
  }

  set title(value) {
    if (typeof value !== "string" || value.length === 0) {
      throw new ProductException("Title must be a string.");
    }
    this._title = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    if (typeof value !== "string" || value.length === 0) {
      throw new ProductException("Description must be a string.");
    } 
    if (value.length > 300) {
      throw new ProductException("Description must be less than 300 characters.");
    }
    this._description = value;
  }

  get imageUrl() {
    return this._imageUrl;
  }

  set imageUrl(value) {
    if (typeof value !== "string" || value.length === 0) {
      throw new ProductException("Image URL must be a string.");
    }
    if (!value.endsWith(".jpg") && !value.endsWith(".png")) {
      throw new ProductException("Image URL must end with .jpg or .png.");
    }
    this._imageUrl = value;
  }

  get unit() {
    return this._unit;
  }

  set unit(value) {
    if (typeof value !== "string" || value.length === 0) {
      throw new ProductException("Unit must be a string.");
    }
    if (value.length > 20) {
      throw new ProductException("Unit must be less than 20 characters.");
    }
    this._unit = value;
  }

  get stock() {
    return this._stock;
  }

  set stock(value) {
    if (typeof value !== "number" || value < 0) {
      throw new ProductException("Stock must be a positive number.");
    }
    this._stock = value;
  }

  get pricePerUnit() {
    return this._pricePerUnit;
  }

  set pricePerUnit(value) {
    if (typeof value !== "number" || value < 0) {
      throw new ProductException("Price per unit must be a positive number.");
    }
    this._pricePerUnit = value;
  }

  get category() {
    return this._category;
  }

  set category(value) {
    if (typeof value !== "string" || value.length === 0) {
      throw new ProductException("Category must be a string.");
    }
    this._category = value;
  }

  //createFromJson(jsonValue): Esta función debe convertir el String de JSON recibidoen una nueva instancia de producto (utilizando la clase Product)
  static createFromJson(jsonValue) {
    let obj = JSON.parse(jsonValue);
    return Product.createFromObject(obj);
  }

  // createFromObject(obj): Esta función debe convertir el objeto recibido en una nuevainstancia de producto (utilizando la clase Product) y debe ser capaz de ignorar todosaquellos valores que no pertenezcan a la clase Product.
  static createFromObject(obj, uuid = null) {
    let newProduct = {}
    Object.assign(newProduct, obj);
    Product.cleanObject(newProduct);
    
    let product = new Product(obj.title, obj.description, obj.imageUrl, obj.unit, obj.stock, obj.pricePerUnit, obj.category);
    if (uuid) {
      product._uuid = uuid;
    }

    return product;
  }

  // cleanObject(obj): Esta función debe limpiar el objeto recibido de todos aquellosvalores que no pertenezcan a la clase Product
  static cleanObject(obj) {
    const productProperties = ["uuid", "title", "description", "imageUrl", "unit", "stock", "pricePerUnit", "category"];
    for (let prop in obj) {
      // if prop in productProperties continue, else delete
      if (!productProperties.includes(prop) && !productProperties.includes(prop.slice(1))) {
        delete obj[prop];
      }
    }
  }
}

module.exports = Product;