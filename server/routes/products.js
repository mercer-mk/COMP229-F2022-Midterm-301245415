// modules required for routing
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// define the product model
let product = require("../models/products");

/* GET products List page. READ */
router.get("/", (req, res, next) => {
  // find all products in the products collection
  product.find((err, products) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("products/index", {
        title: "Products",
        products: products,
      });
      console.log(products);
    }
  });
});

//  GET the Product Details page in order to add a new Product
router.get("/add", (req, res, next) => {
  product.find((err, products) => {
    res.render("products/add", {
      title: "Add product",
      products: products,
    });
  });
});

// POST process the Product Details page and create a new Product - CREATE
router.post("/add", (req, res, next) => {
  let newProduct = product({
    Productname: req.body.Productname,
    Productid: req.body.Productid,
    Description: req.body.Description,
    Price: req.body.Price,
  });

  product.create(newProduct, (err, product) => {
    if (err) {
      console.error(err);
      res.end(err);
    } else {
      res.redirect("/products");
    }
  });
});

// GET - process the delete
router.get("/delete", (req, res, next) => {
  let high = req.query?.HighPrice;
  let low = req.query?.LowPrice;
  let productName = req.query?.Productnamedelete;

  if (productName) {
    product.deleteOne({ Productname: productName }, (err) => {
      if (err) {
        console.error(err);
        res.end(err);
      } else {
        res.redirect("/products");
      }
    });
  } else {
    product.deleteMany({ Price: { $gte: low, $lt: high } }, (err) => {
      if (err) {
        console.error(err);
        res.end(err);
      } else {
        res.redirect("/products");
      }
    });
  }
});

// GET the Product Details page in order to edit an existing Product
router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  product.findById(id, (err, productToEdit) => {
    if (err) {
      console.error(err);
      res.end(err);
    } else {
      console.log(productToEdit);
      res.render("products/details", {
        title: "Edit Product",
        products: productToEdit,
      });
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post("/:id", (req, res, next) => {
  let id = req.params.id;

  let updatedProduct = product({
    _id: id,
    Productname: req.body.Productname,
    Productid: req.body.Productid,
    Description: req.body.Description,
    Price: req.body.Price,
  });

  product.updateOne({ _id: id }, updatedProduct, (err) => {
    if (err) {
      console.error(err);
      res.end(err);
    } else {
      res.redirect("/products");
    }
  });
});

module.exports = router;
