const winston = require("winston");
const connectDB = require("./env/db");
const express = require("express");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorhandler = require("./middleware/error");
const authroutes = require("./routers/auth-route");
const mqttroutes = require("./routers/mqttroutes");
const supportmailroutes = require("./routers/supportmail-routes");
const backupdb = require('./routes/backup-dbrouters');

//load envirnment variables
dotenv.config({ path: './.env'});

//Initialize express
const app = express();

//Logger configuration
const logger = winston.createlogger({
   leve: "info",
   format: winston.format.combine(
      winston.format.timestamp()
   ),
   trasports: [
      new winston.transports.File({ filname: "error.log", level:"error"}),
      new winston.transports.File({ filename: "combined.log"}),
   ],
});