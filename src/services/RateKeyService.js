import { config } from "../configs";

export const RateKeyService = {
    getAllKeys:()=> {
        return config.RATE_KEYS;
    },
    validateKeyAccess: (key) => {
        // check if key exist in object,
        // then return the key value in object
        const keys = JSON.parse(config.RATE_KEYS);
        if (keys[key]) {
            return keys[key];
        }
        return false;
    }
}