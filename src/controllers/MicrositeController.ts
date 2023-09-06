import { Request, Response } from "express";
import sendResponse from '../services/ResponseService';
import MicrositeService from "../services/MicrositeService";

export default {
    createMicrosite: async (req: Request, res: Response)  => {
        try {
            const response = await MicrositeService.createMicrosite(req);
            if (!response) {
            return sendResponse(req, res, 400, "Microsite creation request failed");
            }
    
            if (!response.success) {
            return sendResponse(req, res, 400, "Microsite creation attempt", response);
            }
    
            return sendResponse(req, res, 200, "Microsite creation attempt", response);
        } catch (err) {
            console.log(`Error while creating Microsite: ${err}`);
            sendResponse(req, res, 500, `An error occured while processing this request: ${err}`);
        }
    },

    
    updateMicrosite: async (req: Request, res: Response) => {
      try {
            const response = await MicrositeService.updateMicrosite(req);

            if (!response) {
            return sendResponse(req, res, 400, "Microsite update failed");
            }
    
            if (!response.success) {
            return sendResponse(req, res, 400, "Microsite update attempt", response);
            }

            return sendResponse(req, res, 200, "Microsite update attempt", response);
      } catch (err) {
        console.log(`Error while updating Microsite: ${err}`);
        sendResponse(req, res, 500, `An error occured while processing this request: ${err}`);
      }
    },

    deleteSelectedMicrositeField: async (req: Request, res: Response) => {
        try {
            const response = await MicrositeService.deleteSelectedMicrositeField(req);
            if (!response) {
                return sendResponse(req, res, 400, "Field deletion failed");
            }
        
            if (!response.success) {
                return sendResponse(req, res, 400, "Field deletion attempt", response);
            }
    
            return sendResponse(req, res, 200, "Field deletion attempt", response);
        } catch (err) {
          console.log(`Error while deleting selcted microsite field: ${err}`);
          sendResponse(req, res, 500, `An error occured while processing this request: ${err}`);
        }
    }
}
