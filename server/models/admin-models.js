const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//define schema
const adminschema = new mongoosescema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "plase enter the valid email"],
        },
        password: {
            type: String,
            required: [true, "password is required"],
            select: false,
        },
        role: {
            type: String,
            default: 'employee',
        },
    },
    {
        timestamps: true,
    }
)


// pre-save middleware to hash the password before store database
adminschema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.gensalt(10);
    this.password = await bcrypt.hash(this.password, salt);
 next();   
});

// pre-save middleware to hash the password before store database
adminschema.pre("save", async function (next){
    if(!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.gensalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//method to genrate the jwt token for the loggerdin or signedup users
adminschema.methods.getToken = function (){
    return jwt.sign(
        { id:this._id, name: this.name, email: this.email, role: this.role},
        process.env.JWT_SECRET,
        {
            expiresIn: "3d",
        }
    );
};




//method to generate the jwt token for the loggedin or signedup users
adminschema.methods.getToken = function (){
    return jwt.sign(
        { id: this_id, name: this.name, email: this.email, role: this.role},
        proecess.env.JWT_SECRET,
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


  













