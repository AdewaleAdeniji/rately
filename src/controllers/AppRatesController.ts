import { RateKeyService } from "../services/RateKeyService";
import {
    GetAllAppRates,
    FilterCurrencyRates,
    CreateAppRate as CreateRate 
  } from "../services/AppRateService";
import { WrapHandler, getDate, validateRequest } from "../utils";
import { Request, Response } from "express";

export const GetAppRates = WrapHandler(async (req: Request, res: Response) => {
  // get the rates for the day
  console.log('getting all app rates')
  if(req.query && Object.keys(req.query).length > 0){
    console.log('filtering all app rates')
    return await FilterAppRates(req, res);
  }
  const rates = await GetAllAppRates();
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
    appName?: string;
}
// get rates for a particular day
export const FilterAppRates = WrapHandler(async (req: Request, res: Response) => {
    const query: IQuery = req.query;
    var inputDateObject =  undefined;
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

export const ImportAppRates = WrapHandler(async (req: Request, res: Response) => {
  const validate = validateRequest(req.body, ["rates", "key"]);
  if (validate) return res.status(400).json({ message: validate });
  const { rates, key, dateAdded } = req.body;
  const response = await ImportRate(rates, key, dateAdded);
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
  rateAppName: string;
  date?: string;
};

export const ImportRate = async (
  rates: IRate[],
  key: string,
  dateAdded: string
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
      date: rate?.date || getDate(),
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
