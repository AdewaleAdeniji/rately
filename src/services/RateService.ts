import RateModel from '../models/Rates';
import { IRate, RateCurrencies } from '../types/Rates';
import { generateID, getDate } from '../utils';


type ICreateRate = IRate & {
    rateID?: string;
    date?: string;
} 

export const CreateRate = async (rate: ICreateRate) => {
    const rateID = rate.rateFrom + "" + await generateID();
    rate.rateID = rateID;
    // rate.date = getDate();
    return RateModel.create(rate);
}
export const GetAllRates = async () => {
    // use ratemodel to find the last entry of USD, EUR, GBP
    const us = await RateModel.find({ rateFrom: RateCurrencies.USD }).sort({ createdAt: -1 }).limit(1).select("-_id -__v -updatedAt -rateAddedBy");
    const eu = await RateModel.find({ rateFrom: RateCurrencies.EUR }).sort({ createdAt: -1 }).limit(1).select("-_id -__v -updatedAt -rateAddedBy");;
    const gb = await RateModel.find({ rateFrom: RateCurrencies.GBP }).sort({ createdAt: -1 }).limit(1).select("-_id -__v -updatedAt -rateAddedBy");;
    return [us[0], eu[0], gb[0]];
}
export const FilterCurrencyRates = async (query: any) => {

    console.log({  ...query });
    return RateModel.find({ ...query }).select("-_id -__v -createdAt -rateAddedBy");
}