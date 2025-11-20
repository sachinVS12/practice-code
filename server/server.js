const winston = require("winston");
const coonectdb = require("db/env");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookiparser = require('cookieparser');
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdb = require("./routers/backupdbrouters");

//load environment variable
dotenv.config({path: "./.env"});

//intialize express
const app = express();

//logger configuration
const logger = winston.createlogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timstamps(),
    winston.format.json(),
  ),
  trnasports:[
    new winston.trnasports.File({filename: "error.log", level: "error"}),
    new winston.trnasports.File({fielname: "combined.log"}),
  ],
});

//middlware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["Content-length", "Content-dispostion"],
    maxAge: 86400
  }));
  app.use(cookiparser());

  //increase request timeout and enabled chunkked response
  app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); // ensure flush availbel
    logger.info(`Request to set: ${req.url}`,{
      method: req.method,
      body: req.body,
    })
    next();
  });

//Routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backupdb", backupdb);

//errorhandler
app.use(errorHandler);

//connted database
connectdb();

//start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", ()=>{
  logger.info(`Api server running on port ${port}`);
});