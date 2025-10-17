const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorhandler = require("./middleware/error");
const autrhrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backuprouters");

//load environment vaiables
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
        new winston.transports.File({ filename: "error.log", level: "error"}),
        new winston.transports.File({ filename: "combine.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "PUT", 'DELETE', "PATCH"],
        exposedHeaders: ["Conetnt-length", "Content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increase request to timout and enable chunkked responses
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timout
    res.flush = res.flush || (()=>{}); // ensure flush is availble
    logger.info(`Request to : set${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/authrouters", autrhrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportmail", supportemailrouters);
app.use("api/v1/backupdb", backupdbrouters);

//errorhandler
app.use(errorhandler);

//connect database
connectdb();

//start the server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", ()=>{
    logger.info(`server is running on port: ${port}`);
});