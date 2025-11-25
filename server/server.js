const winston = require("winston");
const connectdb = require("./db/env");
const express = require("express");
const cors = require("cors");
const moragn = require("morgan");
const cookiparser = require("cookieparser");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const dotenv = require("dotenv");
const authrouters =require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backupdbrouters");

//Load environemt variable
dotenv.config({path:"./.env"});

//Intialize express
const app = express();

//Logger configuration
const logger = winston.createlogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamps(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({filename: "error.log", level: "error"}),
    new winston.transports.File({filename: "combine.log"}),
  ],
});

//Middlware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["Content-Length", "Content-dispostion"],
    maxage:86400
  }));
  app.use(cookiparser());

  //increase request timeout and enable chunnked responses
  app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); // enable flush is availble
  logger.info(`Requested to set ${req.url}`,{
    method: req.method,
    body: req.body,
  });
  next();
  });

  //Routers
app.use('api/v1/auth', authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backdb", backupdbrouters);

//errorHandler
app.use(errorHandler());

//database connection
connectdb();

//start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", ()=>{
  logger.info(`API server running on port ${port}`);
});