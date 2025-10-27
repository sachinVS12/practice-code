const wintson = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("supportemailrouters");
const backuprouters = require("./routers/backuprouters");

//load environment variable
dotenv.config({path: "./.env"});

//initialize express
const app =express();

//logger configuration
const logger = wintson.createlogger({
 level: "info",
 format: wintson.format.combined(
    wintson.format.timestamps(),
    wintson.format.json()
 ),
 transports: [
    new wintson.transports.File({filename: "error.log", level: "error"}),
    new wintson.transports.File({filename: "combined.log"}),
 ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "PUT", "DELETE", "PATCH"],
        exposeheaders: ["Content-Length", "Content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increase request timeout and enables chunkked responses
app.use((req, res, next)=>{
    req.setTimeout(60000); // 10 minutes timeout
    res.setTimeout(60000); // 1o minutes timeout
    res.flush = res.flush || (()=>{}); //ensure flush is avaialbel
    logger.info(`Requsted to set ${req.url}`, {
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/authrouters", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backupdb", backuprouters);

//errorHandler
app.use(errorHandler);

//connect database
connectdb();

//start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", ()=>{
    logger.info(`server is running on port ${port}`);
});