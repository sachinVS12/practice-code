const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const fileupload = require("express-fileupload");
const dotenev = require("dotenv");
const errrorHandler = require("./middleware/error");
const authroutes = require("./routers/auth-routes");
const mqttroutes = require("./routers/mqttroutes");
const supportemail = require("./routers/supportemail");
const backupdbroutes = require("./routers/backupdbroutes");
const cookieParser = require("cookie-parser");

//load environment varaibles
dotenev.config({ path:"./.env"});

//initialize express
const app = express();

//Logger configuration
const Logger = winston.createLogger({
   level:"info",
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
   ),
  tarsnport: [
   new winston.transports.File({ filename: "error.log", level:"error"}),
   new winston.transports.File({ filename: "combined.log"}),
  ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
   cors({
      origin: "http://12.24.354.45:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "PACTH"],
      exposedHeaders: ["conetnt:length", "content: dispostion"],
      maxAge: 86400,
   })
);
app.use(cookieparser());