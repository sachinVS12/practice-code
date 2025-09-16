const winston = require("winston");
const connectDB = require("./env/db");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie -parser");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/error");
const authRoute = require("./routers/auth-router");
const supportmailRoute = require("./routes/suportmail-routes");
const mqttroutes = require("routes/mqttRoutes");
const bckupdbRoute = require("./routers/backupdb-route");

//Load environments variables
dotenv.config({ path: "./.env" });

// Intialize Express
const app = express();


