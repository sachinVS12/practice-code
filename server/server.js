const winston = require("winston");
const connectdb = require("env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const filupload = require("express-fileupload");
const cookieparser= require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/auth-routers");
const mqttrouters = require("./routers/mqttrouters");
const supportmail = require("./routers/supportemailrouters");
const backupdb = require("./routers/backuprouters");
const fileUpload = require("express-fileupload");

//load enviornment variable
dotenv.config({ path: "./.env"});

//initialize express
const app = express();

//Logger configuration
const Logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timesatmps(),
        winston.format.json()
    ),
    trnasports: [
        new winston.File({ filename: "error.log", level: "error"}),
        new winston.File({ filename: "combine.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin: "http://12.34.56.67:3000",
        method: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-Length", "Conetnt-dispostion"],
        maxAge: 86400
    }),
);

//incremant request  timeout and enable chunkked variables
app.use((req, res, next)=>{
    req.setTimeout(600000); // timeout 10 minutes
    res.setTimeout(600000); //timeout 10 minutes
    res.flush = res.flush || (()=>{}); // ensure flush is availbel
    Logger.info(`Requested to : ${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/authrouters", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemai", supportmail);
app.use("api/v1/backupdb", backupdb);

//error handler
app.use(errorHandler);

//database connection
connectdb();

//start the server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0",()=>{
    Logger.info(`server is running on port: ${port}`);
});