const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const adminSchema = new mongoose.schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "please enter the valid email id"],
        },
        password: {
            type: String,
            select: false,
            required: [true, "password is required"],
        },
    }
)