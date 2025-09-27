const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const cookieparser = require("cokkieparser");
const morgan = require("moragn");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const mqttroutes = require("./routers/mqttroutes");
const authroutes = require("./routes/auth-routes");
const supportemailroutes = require("./routes/supporteamilroutes");
const backupdbrouters = require("./routes/backroutes");


//load environment variable
dotenv.config({ path: "./.env"});

//initialize express
const app = express();

//Logger configuration
const Logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    tarnspots: [
        new winston.transport.File({ filename: "error.log", level: "error"}),
        new winston.transport.File({ filename: "combine.log"}),
    ]
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extende:false}));
app.use(
    cors({
        origin: "https://13.24.65.46.3000",
        methods: [ "GET", "POST", "DELETE", "PUT", "PACTH"],
        exposedHeaders: [ "Content-length", "Conetnt-dispostion"],
        maxage: 86400,
    })
);
app.use(cookieparser());

//increment request timeout and enable chunkked response
app.use( (req, res, next) => {
req.setTimeout(600000); //10 minutes timeout
res.setTimeout(600000); //10 minutes timeout
res.flush = res.flush || (() => {}); //ensure flush is availble
Logger.info(`requested to : ${req.url}`, {
    method: req.body,
    body: req.body,
});
next();
});

//routes
app.use