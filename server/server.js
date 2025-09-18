const winston = require("winston");
const connectdb = require("./env/de");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const errorhandler = require("./middleware/error");
const authroutes = require("./routers/authroutes");
const mqttroutes = require("./routers/mqttroutes");
const supportemailroutes = require("./routers/supportemailroutes");
const backupdbroutes = require("./routers/backupdbroutes");

//load environment variable
dotenv.config({ path: "./.env"});

//initialize 