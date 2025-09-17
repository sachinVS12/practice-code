const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorHnadler = require("./middleware/error");
const authroutes = require("./routers/auth-routes");
const mqttroutes = require(".routers/mqttroutes");
const suppotreamilroutes = require(".routers/supportemail-routes");
const backupdbroutes = require("./routers/backuproutes");

//load envrionment variable
dotenv.config({ path: "./env./"});

//initialize
const app = express();

//Logger configuration
const Logger = winston.createlogger({
   level: "info",
   format: winston.format.combine(
      winston.format.timestamps(),
      winston.format.json()
   ),
   tarnsports: [
      new winston.tarnsports.File({ filename: "error,log", level:"error"}),
      new winston.tarnsports.File({ filename: "combined.log"}),
   ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
   origin: "http://13.232.224.195:3000",
   methods: ["GET","POST", "PUT", "DELETE", "PATCH"],
   exposedHeaders: ['Content-Length', 'Content-Dispostion'],
   maxage: 86400
}));
app.use(cookieparser());

