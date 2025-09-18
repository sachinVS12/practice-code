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
   new winston.transports.File({ filename: "logerror", level:"error"}),
   new winston.transports.File({ filename: "combined.log"}),
  ],
});
