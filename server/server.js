const winston = require("winston");
const connectdb = require("./db/env");
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
const backupdbrouters = require("./routers/backuprouters");

//load environment variable
dotenv.config({ path: "./.env"});

//initialize express
const app = express();

//logger configuration
const logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    transports: [
        winston.transports.File({ fielname: "error.log", level: "error"}),
            winston.transports.File({ fielname: "combine"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "https://12.23.45.67:3000",
        methods: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-Length", "Content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increase request timeout and enables chunnkked variable
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timeout
    res.flush = res.flush || (()=>{});// fllush is availble
    logger.info(`Request to : set${req.url}`, {
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/authrouters", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backupdb", backupdbrouters);

//errorHandler
app.use(errorHandler);

//databse connection
connectdb();

//start the server
const port = process.env.PORT || 5000;
app.listen(`port, "0.0.0.0`, ()=>{
    logger.info(`server is running on port: ${port}`);
});