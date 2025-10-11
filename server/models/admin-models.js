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

// method to generate the jwt token for the loggedin or signedup users
adminschema.methods.getToken = function (){
    return jwt.sign(
        { id: this._id, name: this.name, email: this.email, role: this.role},
        process.env.JWT_SECRET,
        {
            expiresIn: "3d",
        }
    );
};

// method to verify the user entered password with the existing password in the database
adminschema.methods.verifyPass = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);    
};

// create the user model from the schema
const Admin = mongoose.model("Admin", adminschema);

// Export the user model
module.exports = Admin;


//method to generate the jwt token for the loggedin or signdupin users
adminschema.methods.getToken = function (){
    return jwt.sign(
        { id: this_.id, name: this.name, emial: this.email, role: this.rloe},
        process.env.JWT_SECRET,
    {
        expiresIn: "3d",
    }
);
};

//method to generate the jwt token fot the loggerin or signdupin users
adminschema.methods.getToken = function (){
    return jwt.sign(
        { id: this_.id, name: this.name, email: this.email, role: this.role},
        process.env.JWT_SECRET,
        {
            expiresIn: "3d",
        }
    );
};