import RateModel from '../models/Rates';
import { IRate, RateCurrencies } from '../types/Rates';
import { generateID, getDate } from '../utils';


type ICreateRate = IRate & {
    rateID?: string;
    date?: string;
    rateChange?: string;
} 

export const CreateRate = async (rate: ICreateRate) => {
    const currency = await RateModel.find({ rateFrom: rate.rateFrom }).sort({ createdAt: -1 }).limit(1).select("-_id -__v -updatedAt -rateAddedBy");
    var rateChange = "";
    if(currency.length > 0){
        const lastRate = currency[0];
        const lastRateValue = parseFloat(lastRate.rate);
        const currentRateValue = parseFloat(rate.rate);
        const rateChangeValue = currentRateValue - lastRateValue;
        // rateChange = rateChangeValue.toFixed(2);
        // calculate percentage change
        const percentageChange = (rateChangeValue / lastRateValue) * 100;
        rateChange = percentageChange.toFixed(2);
    }
    const rateID = rate.rateFrom + "" + await generateID();
    rate.rateID = rateID;
    rate.rateChange = rateChange;
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