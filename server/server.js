const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const morgan = require("morgan");
const cookieparser = require("cookie-Parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authroutes = require("./routers/auth-routes");
const mqttroutes = require("./routers/mqttroutes");
const supportemailroutes = require("./routers/supportemail-routes");
const backupdbroutes = require("./routers/backupdbroutes/");

//load environment variables
dotenv.config({ path: "./.env"});

//exprss initiliaze
const app = express();

//Logger configuration
const Logger = winston.createLogger({
   level: "info",
   format: winston.format.combine(
      winston.format.timestamp,
      winston.format.json
   ),
   trasports: [
      new winston.trasports.File({ filename: "eeror.log", level: "error"}),
      new winston.trasports.File({ filename: 'combined.log'}),
   ],
});
