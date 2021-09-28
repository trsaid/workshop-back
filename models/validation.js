// VALIDATOR
const Joi = require("joi");

//  register Validation

const registerValidation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().alphanum().min(3).max(30).required(),
        lastname: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().min(6).email({ minDomainSegments: 2 }).required(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    return schema.validate(data);
};

//  login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email({ minDomainSegments: 2 }),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;

module.exports.loginValidation = loginValidation;
