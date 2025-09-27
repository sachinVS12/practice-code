const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authroutes = require("./routers/auth-routes");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supporteamils");
const backupdbrouters = require("./routers/backuprouters");

//load environment variable
dotenv.config({ path:"./.env"});

//initialize express
const app = express();

//Logger configuration
const Logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level:"error" }),
        new winston.transports.fileupload({ filename: "combine.error"}),
    ]
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
    origin:"https://13.52.35.37:3000",
    method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    exposeHeaders: ["Conetent-Length", "Conetent-dispostion"],
    maxage: 86400,
    })
);
app.use(cookieparser())

//increase timeout and enable chunkked respons
app.use((req, res, text) =>{
    req.setTimeout(600000); //ten minute timeout
    res.setTimeout(600000);// 1o minute timeout
    res.flush = res.flush || (()=>{});
    Logger.info(`requested to: ${req.url}`,{
        method: req.body,
        body: req.body,
    });
    next();
});


