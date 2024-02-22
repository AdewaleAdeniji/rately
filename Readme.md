Certainly! Here's the properly formatted RateLy API Documentation:

---

## RateLy API Documentation

Welcome to RateLy, your go-to service for real-time currency exchange rates across various applications. This documentation provides a detailed guide on our API endpoints to help you seamlessly integrate and leverage RateLy's powerful features.

---

### Get All Rates Today

**Endpoint:** 
```
GET {{RATELY_BASE_URL}}/rates
```

**Description:**
This endpoint returns a comprehensive list of exchange rates for various currencies on the specified date.

---

### Filter Rates

**Endpoint:** 
```
GET {{RATELY_BASE_URL}}/rates?date=2024-02-20&rateFrom=USD&rateTo=NGN
```

**Allowed Parameters:**
- `date`: Date in the format `YYYY-MM-DD`
- `rateFrom`: Source currency
- `rateTo`: Destination currency

**Description:**
Filter exchange rates based on specific criteria, such as date, source currency, and destination currency. This allows you to tailor the information to your specific needs.

---

### Get All App Rates Today

**Endpoint:** 
```
GET {{RATELY_BASE_URL}}/apprates
```

**Description:**
Retrieve all current exchange rates for different applications. This endpoint returns a comprehensive list of rates for various currencies on the specified date.

---

### Filter App Rates

**Endpoint:** 
```
GET {{RATELY_BASE_URL}}/apprates?date=2024-02-20&rateFrom=USD&rateTo=NGN&rateAppName=grey
```

**Allowed Parameters:**
- `date`: Date in the format `YYYY-MM-DD`
- `rateFrom`: Source currency
- `rateTo`: Destination currency
- `rateAppName`: Application name

**Description:**
Filter exchange rates based on specific criteria, such as date, source currency, destination currency, and application name. This allows you to tailor the information to your specific needs.

---

### Get Rate By Rate ID

**Endpoint:** 
```
GET {{RATELY_BASE_URL}}/rate/:rateID
```

**Description:**
Retrieve a specific rate by its unique identifier. This endpoint returns detailed information about the exchange rate, including the source currency, destination currency, rate value, and date.

---

### Subscribe to Webhook

**Endpoint:**
```
POST {{RATELY_BASE_URL}}/subscribe
```

**Description:**
Subscribe to RateLy's webhook to receive automatic updates on currency exchange rates. By subscribing, you ensure that your application stays up-to-date with the latest rate information.

You can use this endpoint to subscribe to a webhook and receive notifications when the app rates change. The payload you will get on your endpoint:
```json
{
  "rate": "2100",
  "rateFrom": "USD",
  "rateTo": "NGN",
  "rateID": "USDZwJ01gV170851705763496968w5Uds",
  "date": "2024-02-21",
}
```

*Note: You can use the `getRateByRateID` endpoint to verify the authenticity of the webhook rate.*

---