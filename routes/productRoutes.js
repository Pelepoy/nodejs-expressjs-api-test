const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route("/").get(getProducts)
.post(validateToken, createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(validateToken, updateProduct)
  .delete(validateToken, deleteProduct);

module.exports = router;
