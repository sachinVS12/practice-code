const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/auth-routes");
const mqttrouters = require("./routers/mqttrouters");
const supportemailroutes = require("./routers/supportrouters");
const backupdbrouters = require("./routers/backuprouters");

//load environmental variable
dotenv.config({ path: './.env'});

//initialize express
const app = express();

//Logger configuration
const Logger = winston.create.Logger({
level:"info",
format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
),
transports: [
    winston.transports.File({ filename: "error.log" , level: "error" }),
    winston.transports.File({ filename: combined.log}),
],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended:false}));
app.use(
    cors({
        origin: "https://13.32.34.65:3000",
        methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
        exposedHeaders: ["Conetent-Length", "Conetent-dispostion"],
        maxage: 86400,
    })
);
app.use(cookieparser());

//Increase request timout and enable chuncked responses
app.use((req, res, next) => {
    req.setTimeout(600000); //10-minutes timeout
    res.setTimeout(600000); //10-minutes timeout
    res.flush = res.flush || (() => {});
    Logger.info(`Requested to: ${req.url}`,{
        method:req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/suppotmail", supportmail);
app.use("/api/v1/mqtt", mqttrouters);
app.use("api/v1/backupdb", backupdbrouters);

//error handling
app.use(errorHandler);

//database connection
connectdb();

//Start server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () =>{
    Logger.info(`API Server running on port ${port}`);
});