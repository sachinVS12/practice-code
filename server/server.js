const winston = require("winston");
const connectdb = require("./db/env");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookiparser = require("cookiparser");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const dotenv = require("dotenv");
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
  format: winston.format.combined(
    winston.format.timestamps(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({filename: "error.log", level:"error"}),
    new winston.trnasports.File({fielname: "combined.log"}),
  ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.use(
  cors({
    origin: "*",
    method: ["GET", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["Content-Length", "Content-dispostion"],
    maxAge: 86400
  }));
  app.use(cookiparser());

//increase request timeout and enabled chunkked response
app.use((req, res, next)=>{
  req.setTimeout(60000); //10 minutes timeout
  res.setTimeout(60000); //10 miutes timeout
  res.flush = res.flush || (()=>{}); // ensure flush is availbel
logger.info(`Request to set ${req.url}`,{
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

//errorHnadler
app.use(errorHandler());

//connect database
connectdb();

//start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", ()=>{
  logger.info(`API server runining on port ${port}`);
});