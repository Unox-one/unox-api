import { Request } from "express";
import Microsite from "../models/Microsite";
import User from "../models/User";
import Validator from "../models/Validator";


export default {
    createMicrosite: async (req: Request)  => {
        try {
            const requester = await User.findById(req.body.user);
            if (!requester) {
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            const validation = Validator.validateMicrosite(req.body);
            if (validation.error) {
                return {
                    success: false,
                    message: validation.error.details[0].message
                };
            }

            const microsite = await Microsite.create(req.body);
            console.info(`Microsite created for: ${requester.username}`);

            return {
                success: true,
                message: "Microsite created successfully",
                microsite
            };
        } catch (err) {
            console.log(`Error while updating microsite: ${err}`);
            throw new Error(`Error while updating microsite: ${err}`);
        }
    },

    updateMicrosite: async (req: Request) => {
        try {
            const { micrositeId } = req.params;            
            const microsite = await Microsite.findById(micrositeId);      
            if (!microsite) {
                return {
                    success: false,
                    message: "Microsite does not exist"
                };
            }

            const validation = Validator.validateMicrosite(req.body);
            if (validation.error) {
                return {
                    success: false,
                    message: validation.error.details[0].message
                };
            }
      
            const updatedMicrosite = await Microsite.findByIdAndUpdate(micrositeId, req.body, {new:true});
            return {
                success: true,
                message: "Microsite updated succesfully",
                updatedMicrosite
            };
        } catch (err) {
            console.log(`Error while updating microsite: ${err}`);
            throw new Error(`Error while updating microsite: ${err}`);
        }
    },

    deleteSelectedMicrositeField: async (req: Request) => {
        try {
            const { micrositeId, fieldName } = req.params;            
            const microsite = await Microsite.findById(micrositeId);      
            if (!microsite) {
                return {
                    success: false,
                    message: "Microsite does not exist"
                };
            }

            const fieldSelector: Record<string, number> = {};
            fieldSelector[`${fieldName}`] = 1;
      
            const updatedMicrosite = await Microsite.findByIdAndUpdate(micrositeId, {
                $unset: fieldSelector
            }, {new:true});

            return {
                success: true,
                message: "Selected field deleted succesfully",
                updatedMicrosite
            };
        } catch (err) {
            console.log(`Error while deleting selcted microsite field: ${err}`);
            throw new Error(`Error while deleting selcted microsite field: ${err}`);
        }
    }
}
