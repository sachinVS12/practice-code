const winston = require("winston");
const connectdb = require("./db/env");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookiparser = require('cookie-parser');
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");

const app = express()