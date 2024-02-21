import {
  WrapHandler,
  generateID,
  validateEmail,
  validateRequest,
  validateWebhookURL,
} from "../utils";
import { Request, Response } from "express";
import SubModel from "../models/subscribers";
import { RateKeyService } from "../services/RateKeyService";
import axios from "axios";
import hookLogs from "../models/hookLogs";
import RateModel from "../models/Rates";

export const JoinSubscribers = WrapHandler(
  async (req: Request, res: Response) => {
    const val = validateRequest(req.body, ["email", "webhookURL", "appName"]);
    if (val) return res.status(400).json({ message: val });
    const { email, webhookURL, appName } = req.body;
    // validate email, webhookURL
    const emailVal = validateEmail(email);
    if (!emailVal) return res.status(400).json({ message: "Invalid email" });
    const webhookVal = validateWebhookURL(webhookURL);
    if (!webhookVal)
      return res.status(400).json({ message: "Invalid webhookURL" });
    // check if email already exists
    const emailExists = await SubModel.findOne({ subscriberEmail: email });
    if (emailExists)
      return res.status(400).json({ message: "Email already exists" });
    // save to db
    const subscriberID = await generateID();
    const save = await SubModel.create({
      subscriberEmail: email,
      subscriberWebhookURL: webhookURL,
      subscriberAppName: appName,
      subscriberID,
    });

    if (save)
      return res.json({
        message: "Subscribed successfully",
        subscriberKey: subscriberID,
      });
    return res.status(400).json({ message: "Failed to subscribe" });
  }
);

export const GetAllSubscribers = WrapHandler(
  async (req: Request, res: Response) => {
    // validate key in query
    const key = req.query.key as string;
    if (!key) return res.status(400).json({ message: "Invalid key" });
    // call the keyservice
    const hasAccess = await RateKeyService.validateKeyAccess(key);
    if (!hasAccess) return res.status(400).json({ message: "Invalid key." });
    // get all subscribers
    const subscribers = await SubModel.find().select("-_id -__v");
    res.json(subscribers);
  }
);

export const Unsubscribe = WrapHandler(async (req: Request, res: Response) => {
  const val = validateRequest(req.body, ["email"]);
  if (val) return res.status(400).json({ message: val });
  const { email } = req.body;
  //update the status to false
  const update = await SubModel.updateOne({ email }, { subscribed: false });
  if (update) return res.json({ message: "Unsubscribed successfully" });
  return res.status(400).json({ message: "Failed to unsubscribe" });
});

// Remove the duplicate import statement for SubModel
// import SubModel from '../models/subscribers';
export const CallSubscribers = WrapHandler(
  async (req: Request, res: Response) => {
    // get all rates that have subscriberCalled false
    const key = req.query.key as string;
    if (!key) return res.status(400).json({ message: "Invalid key" });
    // call the keyservice
    const hasAccess = await RateKeyService.validateKeyAccess(key);
    if (!hasAccess) return res.status(400).json({ message: "Invalid key." });

    const rates = await RateModel.find({ subscriberCalled: false }).select({
      _id: 0,
      __v: 0,
      rateAddedBy: 0,
      createdAt: 0,
      updatedAt: 0,
      subscriberCalled: 0,
    });
    // call the webhook for each rate
    // console.log(rates);
    const responses = [];
    for (const rate of rates) {
      console.log("calling subscribers for rate", rate.rateID);
      const response = await CallAllSubscriberWebhooks(rate);
      responses.push({ ...response });
      // update the subscriberCalled to true
      await RateModel.updateOne(
        { rateID: rate.rateID },
        { subscriberCalled: true }
      );
    }
    res.json({ message: "Subscribers called successfully", responses });
  }
);
export const CallAllSubscriberWebhooks = async (rate: any) => {
  const subscribers = await SubModel.find({ subscribed: true });
  const sendsList = [];
  for (const subscriber of subscribers) {
    // call the webhook
    // console.log(`Calling ${subscriber.subscriberWebhookURL} for ${subscriber.subscriberEmail}`);
    // update the hits + 1
    await SubModel.updateOne(
      { subscriberID: subscriber.subscriberID },
      { $inc: { subscriberHits: 1 } }
    );

    // call the webhook
    const response = await callWebhook(
      subscriber.subscriberWebhookURL,
      rate,
      subscriber
    );
    // console.log(response);
    sendsList.push({ ...response });
  }

  const response = {
    rate,
    subscribers: sendsList,
    failedSubscribers: sendsList.filter((sub: any) => !sub.status),
    successfulSubscribers: sendsList.filter((sub: any) => sub.status),
    totalSubscribers: sendsList.length,
    totalFailed: sendsList.filter((sub: any) => !sub.status).length,
    totalSuccessful: sendsList.filter((sub: any) => sub.status).length,
  };
  await saveHookLogs(response);
  return response;
};
// write callWebhook function that takes url and payload, and calls the endpoint

export const callWebhook = async (
  url: string,
  payload: any,
  subscriber: any
) => {
  try {
    console.log("Calling webhook - ", url);
    const response = await axios.post(url, payload);
    return {
      status: true,
      data: response.data,
      subscriber: subscriber.subscriberEmail,
    };
  } catch (error) {
    return {
      status: true,
      data: error,
      subscriber: subscriber.subscriberEmail,
    };
  }
};
export const saveHookLogs = async (logs: any) => {
  return await hookLogs.create({ ...logs, hookID: await generateID() });
};
