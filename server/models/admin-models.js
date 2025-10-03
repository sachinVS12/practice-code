const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


//Define the user schema
const adminSchema = new mongoose.adminSchema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "please enter a valid email address"],
        },
        password: {
            type: String,
            select: false,
            required: [true, "password is required"],
        },
    }
)