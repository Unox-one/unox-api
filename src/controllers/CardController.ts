import { Request, Response } from "express";
import CardService from '../services/CardService';
import Validator from "../models/Validator";
import sendResponse from '../services/ResponseService';

export default {
    makeCardRequest: async (req: Request, res: Response)  => {
        const { error, value } = Validator.validateCard(req.body);
        if (error) {
            return sendResponse(req, res, 400, error.details[0].message);
        }
        
        const response = await CardService.makeCardRequest(req);
        if (!response) {
          return sendResponse(req, res, 400, "Card request failed");
        }
  
        if (!response.success) {
          return sendResponse(req, res, 400, "Card request attempt", response);
        }
  
        return sendResponse(req, res, 200, "Card request attempt", response);
    },

    makeMultipleCardRequest: async (req: Request, res: Response)  => {
      const response = await CardService.makeMultipleCardRequest(req);
      if (!response) {
        return sendResponse(req, res, 400, "Card request failed");
      }

      if (!response.success) {
        return sendResponse(req, res, 400, "Card request attempt", response);
      }

      return sendResponse(req, res, 200, "Card request attempt", response);
    },

    createDelivery: async (req: Request, res: Response)  => {
      const { error, value } = Validator.validateDeliveryDetails(req.body);
      if (error) {
          return sendResponse(req, res, 400, error.details[0].message);
      }
      
      const response = await CardService.createDelivery(req);
      if (!response) {
        return sendResponse(req, res, 400, "Create delivery failed");
      }

      if (!response.success) {
        return sendResponse(req, res, 400, "Create delivery attempt", response);
      }

      return sendResponse(req, res, 200, "Create delively attempt", response);
    },

    createCardProperty: async (req: Request, res: Response)  => {
      const response = await CardService.createCardProperty(req);
      if (!response) {
        return sendResponse(req, res, 400, "Card property creation failed");
      }

      if (!response.success) {
        return sendResponse(req, res, 400, "Card property creation attempt", response);
      }

      return sendResponse(req, res, 200, "Card property creation attempt", response);
    }
}
