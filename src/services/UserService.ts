import { Request } from "express";
import _ from "lodash";
import moment from "moment";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User";
import UserOtp from "../models/UserOtp";
import Utils from "./Utils";
import emailService from "./EmailService"
import config from "../config";
import MailTemplates from "../enums/PostmarkTemplates";
import PasswordResetToken from "../models/PasswordResetToken";
import EmailSender from "../enums/EmailSender";
import UserToken from "../models/UserToken";


export default {
    signup: async (req: Request)  => {
        const { email, username} = req.body;
        let user = await User.findOne({$or: [{ email }, { username }]});
        
        if (user) {
            return {
                success: false,
                message: "User already exists"
            }
        }

        req.body.email = _.trim(email.toLowerCase());
        req.body.username = !username ? email : username;
        user = await User.create(req.body);
        console.info(`User cretaed: ${email}`);

        const userPayload = {
            userId: user._id,
            username: user.fullName,
            email: user.email,
        };

        const token = Utils.generateSessionToken(userPayload);
        const userToken = new UserToken({
            user: user._id,
            token,
            expiryTime: moment().add(1, "hours").toDate(),
        });
        
        await userToken.save();
        
        const globalMergeVars = {
            user: user.fullName? user.fullName.split(" ")[0] : user.username ? user.username : user.email
        }

        await emailService.sendTemplateEmail(MailTemplates.WELCOME_MESSAGE, EmailSender.NO_REPLY, user.email, globalMergeVars);

        return {
            success: true,
            message: "User registration successful",
            user,
            token
        };
    },

    getAllUsers: async () => {
        try {
          const users = await User.find({});          
          return users;
        } catch (err) {
            console.log(`Error while fetching users: ${err}`);
            throw new Error(`An error occured while processing this request: ${err}`);
        }
    },

    getUserById: async (userId: string) => {
        try {
          const user = await User.findById(userId);
          return user;
        } catch (err) {
            console.log(`Error while fetching user: ${err}`);
            throw new Error(`An error occured while processing this request: ${err}`);
        }
    },

    updateUser: async (req: Request) => {
        try {
            const { userId } = req.params;            
            const user = await User.findById(userId);      
            if (!user) {
                return {
                    success: false,
                    message: "User not found"
                };
            }

            if (req.body.password) {
                return {
                    success: false,
                    message: "Password update not allowed"
                };
            }
      
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, {new:true});
            return {
                success: true,
                updatedUser
            };
        } catch (err) {
            console.log(`Error while updating user: ${err}`);
            throw new Error(`Error while updating user: ${err}`);
        }
    },

    requestVerificationOtp: async (email: string) => {        
        const user = await User.findOne({email});
        if (!user) {
            return {success: false, message: "User does not exist"}
        }
        
        const otp = Utils.getRandomNumber(config.otpLength);
        const userOtp = new UserOtp({
            user: user?._id,
            otp,
            expiryTime: moment().add(config.otpValidityInMinutes, "minutes").toDate(),
            sentTo: email
        });        

        const splitOtp = Utils.splitNumberIntoDigits(Number(otp));
        const filledOtp = Utils.fillArrayWithZeros(splitOtp);
        
        const globalMergeVars = {
            A: filledOtp[0],
            B: filledOtp[1],
            C: filledOtp[2],
            D: filledOtp[3],
            E: filledOtp[4],
            F: filledOtp[5]
        };
      
        try {
          await Promise.all([userOtp.save(), emailService.sendTemplateEmail(MailTemplates.OTP, EmailSender.NO_REPLY, email, globalMergeVars)]);
          return {success: true, message: "OTP sent to your email address"}
        } catch (err) {
          console.warn(`${email} -> OTP persistence error: ${err}`);
          return {success: false, message: "Could not send OTP"};
        }
    },

    verifyUser: async (req: Request) => {
        const otpValidityCheck =  await verifyOtp(req);
        if (!otpValidityCheck.success) {
            return otpValidityCheck;
        }

        await User.findOneAndUpdate({email: req.params.email}, {isVerified: true}, {new: true});

        return {
            success: true,
            message: "User verification successful"
        }
    },

    userLogin: async (req: Request) => {
        const { email, username, password } = req.body;
        if ((!email && !username) || !password) {
            return {
                success: false,
                message: "Supply your 'email or username' and 'password'" 
            }  
        }

        const user = await User.findOne({$or: [{ username }, { email }]});

        if (!user) {
            return {
                success: false,
                message: "Invalid username or password"
            }
        }

        const hashedPassword = user.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);
            
        if (!isMatch) {
            return {
                success: false,
                message: "Invalid username or password"
            }
        }

        const apiToken = crypto.randomBytes(config.tokenLength).toString('hex');
        const loggedInUser = await User.findOneAndUpdate({email: user.email},
            {
                isLoggedIn: true, 
                lastLoggedIn: new Date(),
                apiToken
            },
            {new: true});
            
        return {
            success: true,
            message: "User login successful",
            loggedInUser
        }
    },

    requestPasswordReset: async (req: Request) => {
        const { email, username } = req.body;
        if (!email && !username) {
            return {
                success: false,
                message: "Client's 'username' or 'email' must be provided"
            }
        }

        const user = await User.findOne({$or: [{ email }, { username }]});        
        if (!user) {
            return {
                success: false,
                message: "User does not exist"
            }
        }

        const token = crypto.randomBytes(config.tokenLength).toString('hex');
        const resetToken = new PasswordResetToken({
            user: user._id,
            token,
            expiryTime: moment().add(config.otpValidityInMinutes, "minutes").toDate(),
            sentTo: user.email
        });

        const globalMergeVars = {
            user: user.fullName? user.fullName.split(" ")[0] : user.username ? user.username : user.email
        }
      
        try {
            await Promise.all([resetToken.save(), emailService.sendTemplateEmail(MailTemplates.RESET_PASSWORD, EmailSender.NO_REPLY, user.email, globalMergeVars)]);
            return {
                success: true,
                message: "Password reset email sent",
                token
            }
        } catch (err) {
          console.warn(`${email} -> Paaword reset token persistence error: ${err}`);
          return {success: false, message: "Could not send password reset token"};
        }
    },

    resetPassword: async (req: Request) => {
        const { token } = req.params;
        const { newPassword, confirmNewPassword } = req.body;
        if (!newPassword || !confirmNewPassword) {
            return {
                success: false,
                message: "'newPassword' and 'confirmNewPassword' are required fields"
            }
        }

        if (newPassword !== confirmNewPassword) {
            return {
                success: false,
                message: "The password values provided are not consistent"
            }
        }

        const expectedToken = await PasswordResetToken.findOne({
            token,
            expiryTime: {$gte: new Date()}
        });

        if (!expectedToken) {
            return {
                success: false,
                message: "Invalid or expired token"
            }
        }

        const user = await User.findById(expectedToken.user);
        if (!user) {
            return {
                success: false,
                message: "User does not exist"
            }
        }

        const globalMergeVars = {
            user: user.fullName? user.fullName.split(" ")[0] : user.username ? user.username : user.email
        }

        const hashedPassword = await bcrypt.hash(newPassword, config.saltRounds)
        await User.findByIdAndUpdate(expectedToken.user, {password: hashedPassword}, {new: true});
        await emailService.sendTemplateEmail(MailTemplates.PASSWORD_RESET_SUCCESS, EmailSender.NO_REPLY, user.email, globalMergeVars);
    
        return {
            success: true,
            message: "Password reset successful"
        };
    }    
};

const verifyOtp = async (req: Request) => {
    const { email } = req.params;
    const { otp } = req.body;
    if (!otp) {
        return {
            success: false,
            message: "OTP not specified"
        }
    }

    const expectedOtp = await UserOtp.findOne({
        sentTo: email,
        expiryTime: {$gte: new Date()}
    }).sort({createdAt: -1}).limit(1);

    if (!expectedOtp) {
        return {
            success: false,
            message: "User has not requested an OTP recently"
        }
    }

    if (otp !== expectedOtp.otp) {
        return {
            success: false,
            message: "Invalid OTP"
        }
    };

    return {
        success: true,
        message: "OTP verification successful"
    };
}
