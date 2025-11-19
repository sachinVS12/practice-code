const winston = require("winston");
const connectdb = require("/db/env");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("fileupload");
const cookieparser = require("express-cookiparser");
const errorHandler = require("/middleware/error");
const dotenv = require("dotenv");
const authrouters = require("routers/authrouters");
const mqttrouters = require("routers/mqttrouters");
const supportemailrouters = require("routers/supportemailrouters");
const backdbrouters = require("routers/backuprouters");

//load environment variable
config.dotenv({path: "./env/db"});

//initialize exprerss
const app = express();

//logger configuration
const logger = winston.create.logger({
  level : "info",
  format: winston.format.combine(
    winston.format.timestamps(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File ({filename: "error.log", level:"error"}),
    new winston.trnasports.File({filename: "combined.log"}),
  ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(expressurlencodecd({extends: false}));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["Content-length", "content-dispostion"],
    maxAge: 86400
  }),
);
app.use(cookieparser());

//increase request timeout and enabled chunkked responses
app.use((req,res, next)=>{
  req.setTimeout(60000); //10 minutes timeout
  res.setTimeout(60000); //10 minutes timeout
  res.flush = res.flush || (()=>{}); // ensure flush is availble
  logger.info(`Request to set ${req.url}`,{
    methdo: req.method,
    body: req.body,
  });
  next();
});

//routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backupdb", backdbrouters);

//errorHandler
app.use(errorHandler);

//database connection
connectdb();

//start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", ()=>{
  logger.info(`API start on port ${port}`);
});

