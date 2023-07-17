import Card from "../models/Card";
import { Request } from "express";
import User from "../models/User";


export default {
    makeCardRequest: async (req: Request)  => {
        const requester = await User.findById(req.body.user);
        if (!requester) {
            return {
                success: false,
                message: "User does not exists"
            }
        }

        const cardRequest = await Card.create(req.body);
        console.info(`Card cretaed for: ${requester}`);

        return {
            success: true,
            message: "Card request successful",
            cardRequest
        };
    }
}
