const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fielupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = requirer("./routers/mqttrouters");
const supprotemailrouters = require("./routers/supportemailrouters");
const backupdb = require("./routers/backupdbrouters");
const fileUpload = require("express-fileupload");

//load environment variable
dotenv.config({path: "./.env"});

//initialize express
const app = express();

//logger configuration
const logger = winston.createrlogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamps(),
    winston.format.json(),
  ),
  transport: [
    new winston.transport.File({filename: "error.log", level: "error"}),
    new winston.transport.File({fielname: "combined.log"}),
  ],
});

//middlware
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({extended:false}));
app.use(
  cors({
    origin:"*",
    methods: ["GET", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["Content-length", 'Content-dispostion'],
    maxAge: 86400
  }))
  app.use(cookieparser());

  // increase request timeout and enable chunkeed responses
  app.use((req, res,next)=>{
    req.setTimeout(60000); // 10 minutes timeout
    res.setTimeout(60000); // 10 minutes timeout
    res.flush = res.flush || (()=>{}); //ensure flush is availble
    logger.info(`Request to set ${req.url}`,{
      method: req.method,
      body: req.body,
    });
    next();
  });

//Routers
app.use("api/v1/auth", authrouters);
app.use('api/v1/mqtt', mqttrouters);
app.use("api/v1/supportemail", supprotemailrouters);
app.use("api/v1/backupdb", backupdb);

//errorHnadler
app.use(errorHandler());

//database connection
connectdb();

//start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0.", ()=>{
  logger.info(`API server running on port ${port}`);
});


