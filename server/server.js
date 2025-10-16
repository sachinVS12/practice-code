const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieparser = require("cokkieparser");
const dotenev = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backuprouters = require("./routers/backuprouters");

//load environment variable
dotenev.config({ path: "./.env"});

//initiaize express
const app = express();

//logger configuration
const logger = winston.createlogger({
    level : "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error"}),
        new winston.transports.File({ filename: "combine"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "http://12.34.56.78:3000",
        method: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-Length", "Content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increase request to timeout and enables chunkked responses
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes time out
    res.setTimeout(60000); //10 minutes time out
    res.flush = res.flush || (()=>{}); //flush is availbel
    logger.info(`request to : set${req.url}`, {
        method: req.method,
        body: req.body,
    });
    next();
});

//routers
app.use("api/v1/authroutes", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backupdb", backuprouters);

//errorhandler
app.use(errorHandler);

//connect database
connectdb();

//start the server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => {
    logger.info(`server is running on port ${port}`);
});