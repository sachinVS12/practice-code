const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { timeStamp } = require("console");

const adminschema = new mongooseschema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        email: {
             type:String,
             required: [true, "email is required"],
             unique: true,
             match: [/.+\@.+\..+/, "please enter valid email id"],
        },
        password: {
            type: String,
            select: false,
            required: [true, "password is required"],
        },
        resetpasswordtoken: String,
        resetpasswordexpeire: Date,
        role:{
            type: String,
            default: "admin",
        },
    },
    {
        timeStamp:true,
         toJson : { virtuals: true},
        toObject : { virtuals: true},
    }       
)