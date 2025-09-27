const winston = require("winston");
const connectdb = require(".env/db");
const express = require("express");
const cors = require("cors");
const moragn = require("moragn");
const fileupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authroutes = require("./routes/auth-routes");
const mqttroutes = require("./routers/mqttroutes");
const supportemailroute = require("./routers/supportemailroutes");
const backuproutes = require("./routers/backruoutes");

//load environment variable
dotenv.config({ path: "./.env"});

//initilaize express
const app = express();

//Logger
const Logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    transports : [
        new winston.transports.File({ filename: "error.log", level: "error"}),
        new winston.transports.File({ filename: "combined.log"}),
    ],
});

//middleware
app.use(express.json);
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
    origin: "https://13.25.63.89:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["Conetnt-Length", "Contenet-dispostion"],
    maxAge: 86400,
    })
);
app.use(cookieparser());

