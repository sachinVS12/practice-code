const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cokieparser = require("cookie-parser");
const fileupload = require("fileupload");
const dotenv = require("dotenv");
const errorHnadler = require("./middleware/error");
const mqttroutes = require("./routers/mqtttroutes");
const authroutes = require("./routers/auth-routes");
const supporteamilroutes = require("./routers/supportemailroutes");
const backupdbroutes = require("./routes/backupdbroutes");

//load environment variable
dotenv.config({ path: "./.env"});

//initialize express
const app = express();

//logger configuration
const logger = winston.createlogger({
   level: "info",
   format: winston.format.combine(
    winston.format.timstamp(),
    winston.format.json()
   ),
   transports: [
    new winston.transports.File({ filename: "error.log", level: "error"}),
    new winston.transports.File({ filename: "combined.log"}),
   ],
});