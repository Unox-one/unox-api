import Joi from "joi";


export default {
  validateUser: (user: Record<string, any>) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string(),
      fullName: Joi.string(),
      password: Joi.string().required(),
      role: Joi.string().valid("regular_user", "enterprise_user"),
      isVerified: Joi.boolean(),
      isActive: Joi.boolean(),
    });
  
    return schema.validate(user);
  },

  validateCard: (card: Record<string, any>) => {
    const schema = Joi.object({
      user: Joi.string().required(),
      type: Joi.string().required().valid("branded", "custom", "team"),
      quantity: Joi.number(),
      displayName: Joi.string(),
      phoneNumber: Joi.string(),
      color: Joi.string(),
    });
  
    return schema.validate(card);
  }
};
