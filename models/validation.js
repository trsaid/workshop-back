// VALIDATOR
const Joi = require("joi");

//  register Validation

exports.registerValidation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().alphanum().min(3).max(30).required(),
        lastname: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().min(6).email({ minDomainSegments: 2 }).required(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    return schema.validate(data);
};

//  login Validation
exports.loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email({ minDomainSegments: 2 }),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });
    return schema.validate(data);
};

//New application validation
exports.appValidation = (data) => {
    const schema = Joi.object({
        libelle: Joi.string().alphanum().min(3).max(30).required(),
        expirationDelay: Joi.number().min(1).max(365).required(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    return schema.validate(data);
};

