import { ServerClient } from 'postmark';
import config from "../config";


const postmark = new ServerClient(config.postmarkServerToken);

export default {
  sendTemplateEmail: async (
    templateId: number, 
    sender: string, 
    recipient: string, 
    globalMergeVars: Record<string, any>
  ) => {
    try {
      const emailRequest = {
        From: sender,
        To: recipient,
        TemplateId: templateId,
        TemplateModel: globalMergeVars,
      };
    
      const response = await postmark.sendEmailWithTemplate(emailRequest);
      console.log('Email sent successfully:', response.To);
    } catch (err) {
      console.error('Error sending email:', err);
    }
  }
};
