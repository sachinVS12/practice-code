const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminschema = new mongooseschema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            require: [true, "email is required"],
            unique:true,
            match: [/.+\@.+\..+/, "Enter the valid email id"],
        },
        password: {
            type: String,
            select: false,
            required:[true, "passsword is required"]
        }
    }
)