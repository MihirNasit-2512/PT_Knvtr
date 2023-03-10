const express = require("express");
const app = express();
const dbConfig = require("./V1/Helper/dbConfig");
const router = require("./V1/Router/Routes");
require("./V1/Middleware/passportAuth");

require("dotenv").config();
dbConfig.connect();
app.use(express.json());

app.use("/", router);

app.listen(3000);
