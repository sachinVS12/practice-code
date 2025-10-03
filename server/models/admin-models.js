const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { match } = require("assert");
const { type } = require("os");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        email: {
            type: string,
            required: [true, "email is required"],
            unique: true,
            match: [/..\@.+\..+/, "please enter the valide email"],
        },
        password: {
            type: string,
            select: false,
            required: [true, "password is required"],
        },
        role: {
            type: String,
            default: "admin",
        },
    },
    {
        timesatmps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true}
    }
);