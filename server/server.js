const winston = require("winston");
const connectDB = require("./env/db");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth-router");
const supportmailRoute = require("./routes/supportmail-router");
const mqttRoutes = require("./routers/mqttRoutes");
const backpdRoute = require("./routes/backupdb-Routes");

//load environment variables
dotenv.config({ path: "./.env" });

//Intialize express
const app = express();

// Logger configuration
const logger = winston.createLogger({
   level: "info",
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
   ),
   transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
   ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(cors({
   origin: "http://13.232.224.195:3000",
   methods: ['GET', 'PUT', 'DELETE', 'PATCH'],
   exposedHeadrs: ['content-Length', 'Content-Disposition'],
   maxage: 86400
}));
app.use(cookieParser());

// Increase request timeout and enable chunked reponses
app.use((req, res, next) => {
   req.setTimeout(600000); //10-minute timeout
   res,setTimeout(600000); //10 minute timeout
   res.flush = res.flush || (() => {}); //Ensure flush is available
   logger.info(`Requested to: ${req.url}`, {
      method: req.method,
      body: req.body,
   });
   next();
});

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/suppotmail", supportmailRoutes);
app.use("/api/v1/mqtt", mqttRoutes);
app.use("/api/v1/backupdb", backdbRoute);

// Error handling
app.use(errorHandler);

// Database connection
connectDB();

//start server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", ()=>{
   logger.info(`Api Server running on port ${port}`);
});