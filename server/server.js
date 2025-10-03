const winston = require("winston");
const connectdb = require('./env/db');
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHnadler = require("./middleware/error");
const authrouters = require("./routers/auth-routers");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backupdbrouters");

//load environment variables
dotenv.confif({ path: "./.env"});

//initailiaze express
const app = express();

//Logger configuration
const Logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        winston.transports.File({ filename: "error.log", level: "error" }),
        winston.transports.File({ filename: "combine.log"}),
    ]
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "http://12.14.256.23:3000",
        method: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Conetent-Length", "Content-dispostion"],
        maxAge: 86400,
    }),
);
app.use(cookieparser());

//increase request timeout and enable chunkked response
app.use((req, res, next)=>{
    req.setTimeout(600000); //10 minutes timeout
    res.setTimeout(600000); //10 minutes timeout
    res.flush = res.flush || (()=>{});
    Logger.info(`Requested to: ${req.url}`, {
        method: req.method,
        body : req.body,
    });
   next();
});

//Routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backup", backupdbrouters);

//errorhandler
app.use(errorHnadler());

//database connection
connectdb();

//start server
const port = process.env.PORT || 50000;
app.listen(port, "0.0.0.0", ()=>{
  Logger.info(`API server running on port ${port}`);
});
