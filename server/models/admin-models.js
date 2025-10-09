const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { match } = require("assert");
const { type } = require("os");

const adminschema = new mongooseschema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "enter valid email id"],
        },
        password: {
            type: String,
            select: false,
            required: [true, "password is require"],
        },
        role: {
            type: String,
            default: "Admin",
        }
    },
);

//pre-save middleware to hash the password to before store the database
adminschema.pre("save", async function (next){
    if(!this.ismodefied("password")) {
        return next();
    }
    const salt = await bcrypt.gensalt(10);
    this.password = await bcrypt.hash(this.paasword, salt);
});