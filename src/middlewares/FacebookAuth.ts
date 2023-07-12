import passport from "passport";
import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from "../config";
import User from "../models/User";
import Utils from "../services/Utils";
const { facebook } = config;


const facebookAuth = () => {
    passport.use(
        new FacebookStrategy(
          {
            clientID: facebook.clientId,
            clientSecret: facebook.clientSecret,
            callbackURL: facebook.callbackUrl,
            // profileFields: ['id', 'displayName', 'email'],
          },
          (accessToken: string, refreshToken: string, profile: any, done) => {

            console.log({accessToken, profile});
            
            
          }
        )
    );
}

export default facebookAuth;
