const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

/*
 * @desc Retrieve all products
 * @route GET /api/products
 * @access public
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    message: "All products retrieved successfully!",
    status: true,
    products: products,
  });
});
/*
 * @desc Retrieve a single product
 * @route GET /api/products/:id
 * @access public
 */

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({
    message: "Product retrieved successfully!",
    status: true,
    product: {
      product_name: product.product_name,
      product_description: product.product_description,
      product_price: product.product_price,
      product_tag: product.product_tag,
    },
  });
});

/*
 * @desc Create all products
 * @route POST /api/products
 * @access public
 */

const createProduct = asyncHandler(async (req, res) => {
  // Destructure the request body
  const { product_name, product_description, product_price, product_tag } =
    req.body;
  // Check if all fields are present
  if (!product_name || !product_description || !product_price || !product_tag) {
    res.status(400);
    throw new Error("All fields are required");
  }
  // Create the product
  const createdProduct = await Product.create({
    user_id: req.user._id,
    product_name,
    product_description,
    product_price,
    product_tag,
  });
  res.status(201).json({
    message: "Product created successfully!",
    status: true,
    product: {
      _id: createdProduct._id,
      product_name: createdProduct.product_name,
      product_description: createdProduct.product_description,
      product_price: createdProduct.product_price,
      product_tag: createdProduct.product_tag,
    },
  });
});

/*
 * @desc Update a single product
 * @route PUT /api/products/:id
 * @access public
 */

const updateProduct = asyncHandler(async (req, res) => {
  // Find the product
  const product = await Product.findById(req.params.id);
  // Check if the product exists
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Check if the user is the owner of the product
  if (product.user_id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this product");
  }
  // Update the product's information
  product.product_name = req.body.product_name || product.product_name;
  product.product_description =
    req.body.product_description || product.product_description;
  product.product_price = req.body.product_price || product.product_price;
  product.product_tag = req.body.product_tag || product.product_tag;
  // Save the updated product
  const updatedProduct = await product.save();

  res.status(200).json({
    message: "Product updated successfully!",
    status: true,
    product: {
      _id: updatedProduct._id,
      product_name: updatedProduct.product_name,
      product_description: updatedProduct.product_description,
      product_price: updatedProduct.product_price,
      product_tag: updatedProduct.product_tag,
    },
  });
});

/*
 * @desc Delete a single product
 * @route DELETE /api/products/:id
 * @access public
 */

const deleteProduct = asyncHandler(async (req, res) => {
    
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }
  // Find the product
  const product = await Product.findById(req.params.id);
  // Check if the user exists
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  // Check if the user is the owner of the product
  if (product.user_id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this product");
  }
  // Delete the product
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: `Deleted user for id ${req.params.id}`,
    status: true,
    contact: deletedProduct,
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
