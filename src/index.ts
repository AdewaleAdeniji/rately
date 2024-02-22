import mongoose from "mongoose";
import { config } from "./configs";
import { FilterRates, GetRates, GetRatesByRateID, ImportRates } from "./controllers/RatesController";
const express = require("express");
const bodyParser = require("body-parser");
import { Response } from "express";
import { FilterAppRates, GetAppRates, ImportAppRates } from "./controllers/AppRatesController";
import { CallSubscribers, GetAllSubscribers, JoinSubscribers } from "./controllers/SubscriberController";
import cors from "cors";

const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

//normal rates endpoints
app.get("/v1/api/rates", GetRates);
app.get("/v1/api/rates/search", FilterRates);
app.post("/v1/api/rates", ImportRates);
app.get("/v1/api/rates/:rateID", GetRatesByRateID);

//app rates endpoints
app.get("/v1/api/apprates", GetAppRates);
app.post("/v1/api/apprates", ImportAppRates);
app.get("/v1/api/apprates/search", FilterAppRates);

//subscribe and unsubscribe endpoints
app.post("/v1/api/subscribe", JoinSubscribers);
app.get("/v1/api/call/subscribers", CallSubscribers);
app.get("/v1/api/subscribers", GetAllSubscribers);

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
