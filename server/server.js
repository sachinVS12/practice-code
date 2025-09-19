const winston = require("winston");
const connectdb = require("./.env/db");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieparser = require("cookiepraser");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authroutes = require("./routers/auth-routes");
const mqttroutes = require("./routers/mqttrouters");
const supportemailroutes = require("./routers/suppotemail");
const backupdbroutes = require("./routers/backuproutes");

//load environment variables
dotenv.config("./.env");

//initialize express
const app = express();

//Logger configuration
const Logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded)