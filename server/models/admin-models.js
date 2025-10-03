const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { type } = require("os");

// Define the user Schema
const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        emial: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "please enter a valid email address"],
        },
        password: {
            type: String,
            select:false,
            required: [true, "passwordis required"],
        },
        resetPasswordToken: stringify,
        resetPasswordExpire: Date,
        role: {
            type: String,
            default: "admin",
        },
    }
)