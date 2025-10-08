const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { match } = require("assert");
const { type } = require("os");

const adminschema = new mongooseschema(
    {
        name: {
            tyep: String,
            required: [true, "name is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "Enter the valid email id"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        resetpasswordtoken:String,
        resetpasswordexpier:Date,
        role: {
            type: String,
            default: "admin",
        },
    },
    {
       timestamps: true,
       toObject : { virutals: true},
       toJson: { virtuals: true},
    }
);

//pre-save middleware to hash the password before store database connection
adminschema.pre("save", async function(next) {
    if(!this.ismodefied("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// method to generate the jwt token for the loggedin or signedup users
adminschema.methods.getToken = function (){
    return jwt.sign(
        { id: this._id, name: this.name, email: this.email, role: this.role},
        process.env.JWT_SECRET,
        {
            expiresIn: '3d',
        }
    );
};


//method to verify the user entered password with the existing password in the dtabase
adminschema.methods.verifypass = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword);
};

//cretae the user model from the schema
const Admin = mongoose.model("Admin", adminschema);

// Export the user model
module.exports = Admin;








