const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
        type: String,
        required: [true, "Name field is required"],
        },
        email: {
        type: String,
        required: [true, "Email field is required"],
        unique: true,
        },
        password: {
        type: String,
        required: [true, "Password field is required"],
        },
        isAdmin: {
        type: Boolean,
        required: true,
        default: false,
        },
    },
    {
        timestamps: true,
    }
);    

module.exports = mongoose.model("User", userSchema);