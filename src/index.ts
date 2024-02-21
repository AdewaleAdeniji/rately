import mongoose from "mongoose";
import { config } from "./configs";
import { FilterRates, GetRates, ImportRates } from "./controllers/RatesController";
const express = require("express");
const bodyParser = require("body-parser");
import { Response } from "express";
import { FilterAppRates, GetAppRates, ImportAppRates } from "./controllers/AppRatesController";
import { CallSubscribers, GetAllSubscribers, JoinSubscribers } from "./controllers/SubscriberController";

const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

//normal rates endpoints
app.get("/rates", GetRates);
app.get("/rates/search", FilterRates);
app.post("/rates", ImportRates);

//app rates endpoints
app.get("/apprates", GetAppRates);
app.post("/apprates", ImportAppRates);
app.get("/apprates/search", FilterAppRates);

//subscribe and unsubscribe endpoints
app.post("/subscribe", JoinSubscribers);
app.get("/call/subscribers", CallSubscribers);
app.get("/subscribers", GetAllSubscribers);

app.get("/health", (_: any, res: Response) => {
  return res.status(200).send("OK");
});
mongoose
  .connect(config.MONGODB_URI, {
    dbName: config.DB_NAME,
  })
  .then(() => console.log("connected to mongodb"))
  .catch(() => console.log("error occured connecting to mongodb"));

// Start the express server
app.listen(config.PORT, () => {
  console.log(`App service listening at http://localhost:${config.PORT}`);
});
