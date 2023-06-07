
const expressValidator = require("express-validator");


// checkSchema wrapper
const checkSchema = (schema) => expressValidator.checkSchema(schema);


// get array of errors after checkSchema has been run
const getSchemaErrors = (req) => {
    const errorMessages = [];
    const errors = expressValidator.validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => errorMessages.push(error.msg));
    }

    return errorMessages;
};


module.exports = {
    checkSchema,
    getSchemaErrors
};