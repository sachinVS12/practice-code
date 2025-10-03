const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouter = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdb = require("./routers/backupdbrouters");

//load enviornmrnt variable
dotenv.config({ path: "./.env"});

//initialize express
const app = express();

//Logger confighuration
const Logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.jsom()
    ),
    transports: [
        winston.transports.File({ filename: "error.log", level:"error"}),
        winston.transports.File({ filename: "combine.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "https//12.25.35.46:3000",
        method: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Conetent-Length", "Conetent-Length"],
        maxAge: 86400, 
    }),
);
app.use(cookieparser());

//increase request timeout and enable chunkked response
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timeout
    res.flush = res.flush || (()=>{});
    Logger.info(`requested to: ${req.url}`,{
        methdo: req.method,
        body: req.body,
    });
    next();
});

//routers
app.use("api/v1/auth", authrouter);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backdb", backupdb);

//error Handleing
app.use(errorHandler());

//database connection
connectdb();

//start server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", ()=>{
    looger.info(`API server running on port${port}`);
});