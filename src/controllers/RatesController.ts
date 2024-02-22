import { RateKeyService } from "../services/RateKeyService";
import {
  CreateRate,
  FilterCurrencyRates,
  GetAllRates,
} from "../services/RateService";
import { WrapHandler, validateRequest } from "../utils";
import { Request, Response } from "express";
import RateModel from "../models/Rates";

export const GetRatesByRateID = WrapHandler(
  async (req: Request, res: Response) => {
    const rateID = req.params.rateID;
    console.log('getting rate by id '+ rateID)
    const rate = await GetRateByRateID(rateID);
    if(!rate) return res.status(404).json({ message: "Rate not found" });
    res.json(rate);
  }
);
export const GetRateByRateID = async (rateID: string) => {
  return await RateModel.findOne({ rateID }).select("-_id -__v -createdAt -updatedAt -rateAddedBy");
};
export const GetRates = WrapHandler(async (req: Request, res: Response) => {
  // get the rates for the day
  console.log('getting all rates')
  if (req.query && Object.keys(req.query).length > 0) {
    // check if any object.values is undefined
    console.log('filtering all rates')
    if (Object.values(req.query).includes(undefined)) {
      return res.status(400).json({ message: "Invalid query" });
    }
    return await FilterRates(req, res);
  }
  const rates = await GetAllRates();
  res.json(rates);
});
type IQuery = {
  date?: string;
  createdAt?: {
    $gte: string;
    $lt: string;
  };
  rateFrom?: string;
  rateTo?: string;
};
// get rates for a particular day
export const FilterRates = WrapHandler(async (req: Request, res: Response) => {
  const query: IQuery = req.query;
  var inputDateObject = undefined;
  if (query.date) {
    inputDateObject = new Date(query.date.toString());
  }

  const rates = await FilterCurrencyRates(query);
  delete query.createdAt;

  res.json({
    total: rates.length,
    filtersApplied: {
      ...query,
      date: inputDateObject,
    },
    rates,
  });
});

export const ImportRates = WrapHandler(async (req: Request, res: Response) => {
  const validate = validateRequest(req.body, ["rates", "key"]);
  if (validate) return res.status(400).json({ message: validate });
  const { rates, key } = req.body;
  const response = await ImportRate(rates, key);
  if (!response.status) {
    return res.status(400).json(response);
  }
  res.json(response);
});
type IRate = {
  rateFrom: string;
  rateTo: string;
  rate: string;
  rateAddedBy: string;
};

export const ImportRate = async (
  rates: IRate[],
  key: string
): Promise<{
  error?: string;
  status: boolean;
  response?: any;
}> => {
  // validate key
  const hasAccess = await RateKeyService.validateKeyAccess(key);
  if (!hasAccess) {
    return { error: "Invalid key", status: false };
  }
  // save rates
  const response = [];
  // loop through rates and save them
  for (const rate of rates) {
    const save = await SaveRate({
      ...rate,
      rateAddedBy: hasAccess.name,
    });
    if (save) {
      response.push({ ...rate, status: "success" });
    } else {
      response.push({ ...rate, status: "failed" });
    }
  }
  return {
    status: true,
    response,
  };
};
export const SaveRate = async (rate: IRate) => {
  const create = await CreateRate(rate);
  if (create) {
    return true;
  }
  return false;
};
