const fs = require("fs");
function convertDateString(input) {
    const months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
  
    const dd  = input.split(/\s|,|\s•\s/);
    //console.log(dd)
    const [day, monthStr, time, year] = dd;
    const month = months[monthStr];
    //console.log(day, month ,year)
    if (day && month && year) {
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    }
  
    return null; // Return null for invalid input
  }
function convertRatesToJson(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
  
    const rateEntries = fileContent.split('\n\n');
    const rates = [];
  
    for (let i = 0; i < rateEntries.length; i += 2) {
      try {
        const dateLine = rateEntries[i];
        const rateLines = (rateEntries[i + 1] || '').split('\n');
  
        const dateMatch = dateLine.match(/(\d{2} \w{3}, \d{4})/);
  
        if (dateMatch) {
          const dateStr = dateMatch[1].split('•')[0];
          const day = new Date(dateStr);
          const date = convertDateString(dateStr);
            //console.log(date);
          rateLines.forEach((rateLine) => {
            const [fromCurrency, rate] = rateLine.split("⇛");
            const rateAmount = rate.trim().replace(/[^0-9.]/g, "");
            rates.push({
              rateTo: "NGN",
              rateFrom: extractCurrencyCode(fromCurrency.trim()),
              rate: rateAmount,
              date: date,
            });
          });
        }
      } catch (error) {
        console.error('Error processing entry:', error);
      }
    }
  
    return rates;
  }
  function convertRatesToJsonOld(filePath, date) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const rates = [];
    let currentRateFrom = null;

    lines.forEach((line) => {
      if (line.match(/^\d/)) {
        const [rateFrom] = line.trim().split('\n');
        currentRateFrom = rateFrom.trim();
      } else if (line.match(/:::/)) {
        const [rateAppName, rate] = line.split(':::').map(part => part.trim());
        rates.push({
          rateTo: 'NGN',
          rateFrom: extractCurrencyCode(currentRateFrom),
          rate: extractCurrency(rate),
          rateAppName: rateAppName,
          date: date
        });
      }
    });
  
    return rates;
  }
  function extractCurrency(input) {
    const match = input.match(/₦([0-9,.]+)/);
    return match ? match[1] : '';
  }
  function extractCurrencyCode(input) {
    const match = input.match(/[A-Z]{3}/);
    return match ? match[0] : '';
  }

// Example usage:
const filePath = "./rates.txt";
async function check() {
  const jsonRates = await convertRatesToJson(filePath, "2024-02-22");
  await fs.writeFileSync('rates.json', JSON.stringify(jsonRates, null, 2));
  //console.log(jsonRates[0]);
}
check();
