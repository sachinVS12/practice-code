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

//middlware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extende: false}));
app.use(
   cors({
      origin: "https://13.24.232.24:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      exposeheadres: ["conetnt-lengath", "content:dispostion"],
      maxAge: 864000,
   })
);
app.use(cookieparser());