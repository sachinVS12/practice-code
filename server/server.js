const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieparser = require("cookiparser");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const dotenv = require("dotenv");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backuprouters");

//Load environment variable
dotenv.config({path: "./.env"});

//Initialize express
const app = express();

//Logger configuartion
const logger = winston.createlogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamps(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({fielname: "error.log", level: "error"}),
    new winston.transports.File({fielname: "combined.log"}),
  ],
});

//Middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["content-length", "content-dispostion"],
    maxAge: 86400
  }));
  app.use(cookieparser());

//increase request to timeout and enabled chunkked resposnse
app.use((req, res, next)=>{
  req.setTimeout(60000); //10 minutes timeout
  res.setTimeout(60000); //10 minutes timeout
  res.flush = res.flush || (()=>{});
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
app.use("api/v1/backupdb", backupdbrouters);

//errorHandler
app.use(errorHandler());

//Connectd database
connectdb();

//Start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", ()=>{
  logger.info(`API server running on port ${port}`);
});
