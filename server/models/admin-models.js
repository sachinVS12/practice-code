const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Define the user schema
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
        },
        role: {
            type: String,
            defalut: "employee",
        },
    },
    {
        timestamps: true,
    }
);

// pre-save middleware to hash the password befor store database
adminschema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.gensalt(10);
    this.password = await bcrypt.hash(this.password, salt);
 next();   
});

// method to generate the jwt token for the loggedin or signedupo users
adminschema.methods.getToken = function (){
    return jwt.sign(
        { id: this._id, name: this.name, email: this.email, role: this.role},
        process.env.JWT_SECRET,
        {
            expiresIn: "3d",
        }
    );
};