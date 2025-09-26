const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authroutes = require("./routers/auth-routes");
const mqttroutes = require("./routers/mqttroutes");
const emailsupportroutes = require("./routers/emailsupports");
const backupdbroutes = require("routes/backuproutes");

//load enviornment variable
dotenv.config({ path: "./.env"});

//initialize express 
const app = express();

//Logger configuration
const Logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timesatmps(),
        winston.format.josn()
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level:"error"}),
        new winston.transports.File({ filename: "combined.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended:false}));
app.use(
    cors({
    origin: "https://13.46.36.47:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["Conetent-length", "Conetent-dispostion"],
    maxage: 86400,
})
);
app.use(cookieparser());