const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { match } = require("assert");
const { type } = require("os");
const { timeStamp } = require("console");

const adminSchema = new mongooseSchema(
    {
        name: {
            type: String,
            required: [true, "name is required"]
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "please enter valid email id"]
        },
        password: {
            type: String,
            select: false,
            required: [true, "password is required"]
        },
        resetpasswordtoken: String,
        resetpasswordExpire: Date,
        role: {
            type: String,
            default: "admin",
        },
    },
    {
      timeStamp: true,
      toJson: { virtual: true},
      toObject: { virtual: true}
    }
);