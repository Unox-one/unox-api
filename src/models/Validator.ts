import Joi from "joi";


export default {
  validateUser: (user: Record<string, any>) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string(),
      fullName: Joi.string(),
      password: Joi.string().required(),
      role: Joi.string().valid("regular_user", "enterprise_user"),
      category: Joi.string(),
      subCategory: Joi.string(),
      isVerified: Joi.boolean(),
      isActive: Joi.boolean(),
      apiToken: Joi.string()
    });
  
    return schema.validate(user);
  },

  validateCard: (card: Record<string, any>) => {
    const schema = Joi.object({
      user: Joi.string().required(),
      type: Joi.string().required(),
      color: Joi.string(),
      font: Joi.string(),
      quantity: Joi.number(),
      displayName: Joi.string(),
      phoneNumber: Joi.string(),
      status: Joi.string(),
      url: Joi.string(),
      cost: Joi.number(),
      amountPaid: Joi.number(),
      balance: Joi.number()
    });
  
    return schema.validate(card);
  },

  validateCardType: (cardType: Record<string, string>) => {
    const schema = Joi.object({
      template: Joi.string().required().valid("branded", "custom", "team"),
    });
  
    return schema.validate(cardType);
  },

  validateColor: (color: Record<string, string>) => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });
  
    return schema.validate(color);
  },

  validateFont: (font: Record<string, string>) => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });
  
    return schema.validate(font);
  },

  validateDeliveryDetails: (delivery: Record<string, any>) => {
    const schema = Joi.object({
      user: Joi.string().required(),
      isBatched: Joi.boolean().required(),
      trackingId: Joi.string().required(),
      referencePath: Joi.string(),
      email: Joi.string().required(),
      fullName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      company: Joi.string(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      method: Joi.string(),
      estimatedDeliveryDate: Joi.date(),
      cost: Joi.number(),
      status: Joi.string()
    });
  
    return schema.validate(delivery);
  }
};
