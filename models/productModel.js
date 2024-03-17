const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product_name: {
            type: String,
            required: [true, "Product name field is required"],
        },
        product_description: {
            type: String,
            required: [true, "Product description field is required"],
        },
        product_price: {
            type: Number,
            required: [true, "Product price field is required"],
        },
        product_tag: {
            type: Array,
            required: [true, "Product tag field is required"],
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);