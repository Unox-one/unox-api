import Card from "../models/Card";
import { Request } from "express";
import User from "../models/User";
import CardBatch from "../models/CardBatch";
import Delivery from "../models/Delivery";
import Validator from "../models/Validator";
import CardProperty from "../enums/CardProperty";
import CardType from "../models/CardType";
import Color from "../models/Color";
import Font from "../models/Font";


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
        console.info(`Card posted for: ${requester.username}`);

        return {
            success: true,
            message: "Card request successful",
            cardRequest
        };
    },

    makeMultipleCardRequest: async (req: Request)  => {
        let { user, cards, comment } = req.body;
        const requester = await User.findById(req.body.user);
        if (!requester) {
            return {
                success: false,
                message: "User does not exists"
            }
        }

        if (!cards || cards.length < 1) {
            return {
                success: false,
                message: "Cards to be posted are not provided in the request"
            }
        }
  
        if (!Array.isArray(cards)) {
            return {
                success: false,
                message: "Card list is invalid"
            }
        }

        const invalids = invalidCards(cards, user);
        if (invalids.length > 0) {
            return {
                success: false,
                message: "Invalid cards",
                invalids
            }
        }

        const cardBatch = new CardBatch({
            user,
            comment
        });
        const batch = await cardBatch.save();

        cards = cards.map(card => {
            card.user = user;
            card.batch = batch._id.toString();
            return card;
        })

        const cardPosted = await Card.insertMany(cards);
        console.info(`Cards posted for: ${requester.username}`);

        return {
            success: true,
            message: "Card request successful",
            batch,
            cardPosted
        };
    },

    createDelivery: async (req: Request) => {
        const { user, isBatched } = req.body;
        const cardOwner = await User.findById(user);
        if (!cardOwner) {
            return {
                success: false,
                message: "User does not exists"
            }
        }

        req.body.referencePath = isBatched ? "CardBatch" : "Card";
        const deliveryDetails = await Delivery.create(req.body);
        console.info(`Delivery details posted for: ${cardOwner.username}`);

        return {
            success: true,
            message: "Delivery details posted successfully",
            deliveryDetails
        };
    },

    updateShippingDetails: async (req: Request) => {
        try {
            const { deliveryId } = req.params;            
            const deliveryDetails = await Delivery.findById(deliveryId);      
            if (!deliveryDetails) {
                return {
                    success: false,
                    message: "Delivery details does not exist"
                };
            }
      
            const updatedDeliveryDetails = await Delivery.findByIdAndUpdate(deliveryId, req.body, {new:true});
            return {
                success: true,
                message: "Shipping details updated succesfully",
                updatedDeliveryDetails
            };
        } catch (err) {
            console.log(`Error while updating shipping details: ${err}`);
            throw new Error(`Error while updating shipping details: ${err}`);
        }
    },

    createCardProperty: async (req: Request) => {
        const { cardProperty, propertyValue } = req.body;
        if (!cardProperty || !propertyValue) {
            return {
                success: false,
                message: "'cardProperty' and 'propertyValue' are required fields"
            }
        }

        if (cardProperty === CardProperty.TYPE) {
            const typeProperty = await CardType.create({template: propertyValue});
            return {
                success: true,
                typeProperty
            }
        } else if (cardProperty === CardProperty.COLOR) {
            const colorProperty = await Color.create({name: propertyValue});
            return {
                success: true,
                colorProperty
            }
        } else if (cardProperty === CardProperty.FONT) {
            const fontProperty = await Font.create({name: propertyValue});
            return {
                success: true,
                fontProperty
            }
        } else {
            return {
                success: false,
                message: "Invalid card property"
            }
        }
    },
}

const invalidCards = (cards: Record<string, any>, user: string) => {
    let invalids = [];
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.user = user;        
        const { error, value } = Validator.validateCard(card);
        if (error) {
            invalids.push({line: i + 1});
        }
    }

    return invalids;
}
