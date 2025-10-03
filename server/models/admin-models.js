const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { type } = require("os");
const { match } = require("assert");

//define the user schema
const adminSchema = new mongoose.schema(
    {
        name: {
            type: stringify,
            required: [true, "name is required"],
        },
        email:{
            type:String,
            required: [true, "email is required"],
            unique:true,
            match: [/.+\@.+\..+/, "please enter a valid email address"],
        },
        password: {
            type: String,
            select:false,
            required: [true, "Password is required"],
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        role: {
            type: stringify,
            default: "admin",
        },
    },
    {
        timestamps:true,
        toJSON: { virtuals: true},
        toObject: { virtuals: true}
    }
);