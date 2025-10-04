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
const mqttrouters = require("./routers/mqttrouyters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backuprouters");

//load environment variables
dotenv.config({ path: "./.env"});

//iniliaize express
const app = express();

//logger configuration
const logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    trnasports: [
        new winston.File({ filename: "error.log", level: "error"}),
        new winston.File({ filename: "combined.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin: "http://12.23.34.45:3000",
        method: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-Length", "Conetnt-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increament request timeout and enable chunkked resposne
app.use((req, res, next)=>{
    req.setTimeout(600000); //10 minutes timeout
    res.setTimeout(600000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); //ensure flush is avilable
    logger.info(`Requested to: ${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backdb", backupdbrouters);

//error handler
app.use(errorHandler);

//databse connection
connectdb();

//start the server
const port = process.env.PORT || 50000;
app.listen(port, "0.0.0.0", ()=>{
    logger.info(`server runing on prot: ${prot}`);
});