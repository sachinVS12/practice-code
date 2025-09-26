const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const fileupload = require("express-fileupload");
const errorHandler = require(".middleware/error");
const authroutes = require("./routers/auth-routes");
const mqttroutes = require("./routers/mqttrouters");
const supportemail = requiure("./routers/supportemailroutes");
const backuproutes = require("./routers/backuprouters");

//load enivronment variable
dotenv.config({ path: "./.env"});

//initialize express
const app = express();

//Logger configuration
const Logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ), 
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error"}),
        new winston.transports.File({ filename: "combined.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended:false}));
app.use(
    cors({
        origin: "https://13.25.67.45:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        expressHeaders: ["Conetnet-Length", "Conetnt-Dispostion"],
        maxage: 86400,
    })
);
app.use(cookieParser());