
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


const returnSchemaErrors = (req, res) => {
    const errorMessages = getSchemaErrors(req);
    if (errorMessages.length) {
        console.error(req.body);
        console.error(errorMessages);
        res.status(400).json({ errorMessages });
        return true;
    }
    return false;
};


module.exports = {
    checkSchema,
    getSchemaErrors,
    returnSchemaErrors
};
