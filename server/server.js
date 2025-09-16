const winston = require("winston");
const connectDB = require("./env/db");
const express = require("express");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authRoutes = require("./routes/auth-routes");
const mqttroutes = require("./routes/mqttroutes");
const supportmailroutes = require("./routes/supportmail-routes");
const backupdbroutes = require("./routes/backupdbroutes");
const path = require("path");

//load environment variaables
dotenv.config({ path: "./.env"});

//Initialize express
const app = express();