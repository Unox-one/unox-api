import config from "../config";
import jwt from 'jsonwebtoken';


export default {
    getRandomNumber: (length: number) => {
        const char = '0123456789';
        let output = [];
        for (let i = 0; i < length; i++) {
          let pos = Math.floor(Math.random() * 10);
          output.push(char[pos]);
        }
      
        return output.join('');
    },

    splitNumberIntoDigits: (num: number) => {
      const digits = num.toString().split('');
      return digits.map(Number);
    },

    fillArrayWithZeros: (arr: number[]) => {
      const newArray = [...arr];
      while (newArray.length < config.otpLength) {
        newArray.unshift(0);
      }
    
      return newArray;
    },

    generatePassword: (length: number): string => {
      const characters = config.passwordGenerationCharacters;
      let password = '';
    
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
      }
    
      return password;
    },

    generateSessionToken: (userData: Record<string, any>): string => {
      const token = jwt.sign(userData, config.sessionSecret, { expiresIn: config.sessionExpiry });
      return token;
    },

    decodeUserToken: (token: string) => {
      const userPayload = jwt.verify(token, config.sessionSecret);    
      return userPayload;
    }
};
