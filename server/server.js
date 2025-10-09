const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHnadlers = require("./middleware/error");
const authrouter = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backupdbrouters");

//load environment vaiable
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
        new winston.transports.File({ filename: "error.log", level:"error"}),
        new winston.transports.File({ filename: "combine.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin: "http://13.43.45.45:3000",
        method: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-Length", "Conetnt-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increase request timeout and enable chunkked resposnse
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); //flush is availble
    logger.info(`requested to : ${req.url}`,{
        method: req.method,
        body: req. body
    });
    next();
});

//routers
app.use("api/v1/auth". authrouter);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backupdb", backupdbrouters);

//errorHnadler
app.use(errorHnadler);

//database connection
connectdb();

//start the server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", ()=>{
  logger.info(`server is running on port ${port}`);
});