const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemail = require("./routers/supportemailrouters");
const backupdb = require("./routers/backuprouters");

//load enviornment variables
dotenv.config({ path: "./.env"});

//initialize express
const app = express();

//Logger configuration
const Logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        winston.transports.File({filename: "error.log", level:"error"}),
        winston.transports.File({ filename: "combine.log"}),
    ]
});

//middlware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "http://13.23.45.67:3000",
        method: ["GET", "PUT", "DELETE", "PACTH"],
        exposedHeaders: ["Conetent-length", "Conetnt-dipostion"],
        maxAge: 86400,
    })
);
app.use(cookieparser());

//increase request for timeout  and enable chunkked response
app.use(( req, res, text)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timeout
    res.flush = res.flush || (()=>{});  //ensure flush is availbale
    Logger.info(`Requestd to: set${req.url} `,{
        method:req.method,
        body: req.body,
    });
    next();
});

//routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemail);
app.use("api/v1/backupdb", backupdb);

//error handler
app.use(errorHandler);

//database connection
connectdb();

//start server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", ()=>{
    Logger.info(`API is running on port ${port}`);
});