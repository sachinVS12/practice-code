const winston = require("winston");
const connectdb = require(".db/env");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./router/supportemailrouters");
const backupdbrouter = require("./routers/backuprouters");

//load environment variable
dotenv.config({ path: "./.env"});

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
        new winston.transports.File({ fielname: "combine"}),
    ],
});

//midleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin: "*",
        methods: ["POST", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-Length", "Content-dispostion"],
        maxage: 86400
    }),
);

//increase request to timeout and enable chunnked responses
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); //flush is available
    logger.info(`Requested to  set${req.url}`, {
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/authrouters", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/suppotemail", supportemailrouters);
app.use("api/v1/backuprouters", backuprouters);

//error Handling
app.use(errorHandler);

//connect database
connectdb();

//start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", ()=>{
    logger.info(`Api is runnig on port ${port}`);
});


