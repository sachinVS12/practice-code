const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/auth-routers");
const mqttrouters = requiure("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backuprouters = require("./routers/backuprouters");

//load environment variable
dotenv.config({ path:"./.env"});

//initialize express
const app = express();

//logger configuration
const logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error"}),
        new winston.transports.File({ filename: "combine.log"}),
    ],
});

//middleware
app.use(express());
app.use(fileupload());
app.use(express.urlencoded({extended: false}));
app.use(
    cors({
        origin: "https://12.34.56.78:3000",
        method: [ "GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Conetent-Length", "Conetent-dispostion"],
        maxAge: 86400
    })
);
app.use(cookieparser());

//increase request timeout and enable response
app.use(( req, res, text)=>{
    req.setTimeout(600000); //10 minutes timeout
    res.setTimeout(600000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); //enusre flush is avlaibel;
    logger.info(`Requested to: set${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use('api/v1/supportemail', supportemailrouters);
app.use("api/v1/backupdbrouters", backuprouters);

//error handling
app.use(errorHandler);

//databaseconnection
connectdb();

//start the server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", ()=>{
    logger.info(`server is running on port ${port}`);
})
 