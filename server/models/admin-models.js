const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { match } = require("assert");
const { type } = require("os");

const adminschema = new mongooseschema(
    {
        name: {
            tyep: String,
            required: [true, "name is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "Enter the valid email id"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        resetpasswordtoken:String,
        resetpasswordexpier:Date,
        role: {
            type: String,
            default: "admin",
        },
    },
    {
       timestamps: true,
       toObject : { virutals: true},
       toJson: { virtuals: true},
    }
);

//pre-save middleware to hash the password before store database connection
adminschema.pre("save", async function(next) {
    if(!this.ismodefied("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});