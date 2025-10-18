const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./router/authrouters");
const mqttrouters = require("./router/mqttrouters");
const supportemailrouters = require("./router/supportemailrouters");
const backupdbrouters = require("./router/backuprouters");

//load environment variable
dotenv.config({ path: "./.env"});

//initiaize express
const app = express();

//logger configuration
const logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({filename: "error.log", level: "error"}),
        new winston.transports.File({ filename: "combinelog"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Conetnt-Length", "Content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser);

//increase request timeout and enable chunnked responses
app.use((req, res, next)=>{
    req.setTimeout(60000); // 10 minutes timeout
    res.setTimeout(60000); // 10 minutes timeout
    res.flush = res.flush || (()=>{}); // ensure flush is avilble
    logger.info(`Request to : set${req.url}`, {
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/authrouter", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportmail", supportemailrouters);
app.use("api/v1/backupdb", backupdbrouters); 

//errorHnadler
app.use(errorHandler);

//connect database
connectdb();

//start the server
const port = process.env.PORT || 50000;
app.listen(port, "0.0.0.0",()=>{
    logger.info(`server running on port ${port}`);
});
