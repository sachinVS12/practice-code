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
