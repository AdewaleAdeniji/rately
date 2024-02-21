export const WrapHandler = (controllerFn) => {
  return async (req, res, next) => {
    try {
      await controllerFn(req, res, next);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };
};
// function to return a date in the format YYYY-MM-DD
export const getDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const generateID = () => {
  const timestamp = new Date().getTime().toString(); // get current timestamp as string
  const random = Math.random().toString().substr(2, 5); // generate a random string of length 5
  const userId = timestamp + random; // concatenate the timestamp and random strings
  return generateRandomString(7) + userId + generateRandomString(5);
};
const generateRandomString = (length = 7)  => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let string = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      string += characters.charAt(randomIndex);
    }
    return string;
  }
export const validateRequest = (obj, keys) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const words = key.split(/(?=[A-Z])/); // Split the key based on capital letters
      const humanReadableKey = words.join(" "); // Join the words with spaces
      const formattedKey =
        humanReadableKey.charAt(0).toUpperCase() + humanReadableKey.slice(1); // Capitalize the first letter
      if (!(key in obj)) {
        return `${formattedKey} is required`;
      }
      if(key in obj && obj[key] === "") {
        return `${formattedKey} is required`;
      }
    }
    return false;
  };
export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
export const validateWebhookURL = (url) => {
    const re = /^(http|https):\/\/[^ "]+$/;
    return re.test(url);
  };