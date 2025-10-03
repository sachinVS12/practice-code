const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { emitWarning } = require("process");
const { match } = require("assert");
const { type } = require("os");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: "String",
            required: [true, "name is required"],
        },
        email: {
            type: "String",
            required: [true, "email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "please enter the valide email"],
        },
        password: {
            type: "string",
            select: false,
            required: [true, "password is required"],
        },
        resetpasswordtoken: String,
        resetpasswordexperire: Date,
    }
)