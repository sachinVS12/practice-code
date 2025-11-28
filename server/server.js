const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookipearser = require("cookieparser");
const filupload = require("express-fileupload");
const dotenv = require("dotenv");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdb = require("./routers/backupdb");

//Load environemt variable
dotenv.config({path:"./env"});

//initialize express
const app = express();

//Logger configuration
const logger = winston.createlogger({
    level: "info",
    format:winston.format.combine(
        winston.format.timestamps(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({filename: "error.log", level:"level"}),
        new winston.transports.File({filename: "combined.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fielupload());
app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-Length", "Content-dispostion"],
        maxAge: 86400
    }));
app.use(cookipearser());

//increase request to timeout and enable chunkked response
app.use((req, res, next)=>{
    req.setTimeout(60000);// 10 mintues timeout
    res.setTimeout(60000);// 10 minutes timeout
    res.flush = res.flush || (()=>{});// ensure flush is availble
    logger.info(`Request to set${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backdb", backupdb);

//errorHandler
app.use(errorHandler());

//Database connection
connectdb();

//Start the server
const port = process.env.port || 50000;
app.listen(port, "0.0.0.0", ()=>{
    logger.info(`Api server running on port ${port}`);
});


