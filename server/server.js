const winston = require("winston");
const connectedb = require("./env/db");
const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authroutes = require("./routes/auth-routes");
const mqttroutes = require("./routers/mqttroutes");
const supportmailroutes = require("./routers/supportmailroutes");
const backupdbroutes = require("./routers/backudbproutes");

//load environment variable
dotenv.config({ path:"./.env"});

//initialize express
const app = require(express);

//Logger configuration
const Logger = winston.createLogger({
   level:"info",
   format: winston.format.combine(
      winston.format.timstamps(),
      winston.format.json()
   ),
   tarnsports: [
      new winston.tarnsports.File({filename: "error.log", level:"error"}),
      new winston.tarnsports.File({filename: "combined.log"}),
   ],
});