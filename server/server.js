const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backuprouters = require("./routers/backuprouters");

//load environemnet vaiable
dotenv.config({ path: "./.env"});

//initialize express
const app =express();

//logger configuration
const logger = winston.cretaeLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transpotrs: [
        new winston.transpotrs.File({ filename:"error.log", level: "error"}),
        new winston.transpotrs.File({ filename: "combined"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "http://13.25.45.78:30000",
        method: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Conetnt-Length", "content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increase request timeout and enable chunkked responses
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); //flush is available
    logger.info(`Requested to : set${req.url}`,{
        method: req.method,
        body: req.body
    });
    next();
});

//Routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backupdb", backuprouters);

//errorhandler
app.use(errorHandler);

//database connection
connectdb();

//start the server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", ()=>{
    logger.info(`server is running on port: ${port}`);
});