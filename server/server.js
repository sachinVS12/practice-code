const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authroutes = require("./routers/auth-routers");
const mqttroutes = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backrouters");

//load environment variable
dotenv.config({ path: "./.env"});

//initailize express
const app = express();

//logger configuration
const Logger = winston.createlogger({
    level:"info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    transports: [
        winston.transports.File({ filename: "error.log", level:"error"}),
        winston.transports.File({ filename: "combine.log"}),
    ]
});

//middleware
app.use(exprees.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "http://13.45.24.315",
        methdos: ["GET", "PUT", "POST", "DELETE", "PATCH"],
        exposedHeaders: ["Content-Length", "Conetent-dispostion"],
        maxAge: 86400,
    }),
);
app.use(cookieparser());

//Increase request timeout and enable chunnked response
app.use(( req, res, next) => {
    req.setTimeout(600000); //10-minutes
    res.setTimeout(600000); //10-minutes
    res.flush = res.flush || (()=>{});
    Logger.info(`Requested to: ${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/auth", authroutes);
app.use("api/v1/supportemail", supportemailrouters);
app.use("apo/v1/mqtt", mqttroutes);
app.use("api/v1/backupdb", backupdbrouters);

//error handling
app.use(errorHandler);

// Database connection
connectdb();

//start server
const port = process.env.port || 5000;
app.listen(port, "0,0,0,0", () => {
    looger.info(`API server rinning port ${port}`);
});
