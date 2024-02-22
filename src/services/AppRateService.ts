import RateModel from '../models/appRates';
import { IRate, RateCurrencies } from '../types/Rates';
import { generateID, getDate } from '../utils';


type ICreateRate = IRate & {
    rateID?: string;
    date?: string;
} 

export const CreateAppRate = async (rate: ICreateRate) => {
    const rateID = rate.rateFrom + "" + await generateID();
    rate.rateID = rateID;
    // rate.date = getDate();
    return RateModel.create(rate);
}

export const GetAllAppRates = async () => {
    const getAllRatesByCurrency = async (currency: string) => {
        return await RateModel
            .aggregate([
                { $match: { rateFrom: currency } },
                { $sort: { rateAppName: 1, createdAt: -1 } },
                {
                    $group: {
                        _id: "$rateAppName",
                        latestEntry: { $first: "$$ROOT" }
                    }
                },
                { $replaceRoot: { newRoot: "$latestEntry" } },
                { $project: { _id: 0, __v: 0, updatedAt: 0, rateAddedBy: 0 } }
            ]);
    };

    const currencies = [RateCurrencies.USD, RateCurrencies.EUR, RateCurrencies.GBP];
    // const allRates: { [key in RateCurrencies]: any } = {
    //     USD: null,
    //     EUR: null,
    //     GBP: null
    // };
    const allRates = []

    for (const currency of currencies) {
        const rates = await getAllRatesByCurrency(currency);

        allRates.push(...rates);
    }

    return allRates;
};


export const FilterCurrencyRates = async (query: any) => {

    console.log({  ...query });
    return RateModel.find({ ...query }).select("-_id -__v -createdAt -rateAddedBy");
}