

// pieces of schema that can be reused
const given_name = {
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: {
        given_name: "Enter first name"
    }
};
const family_name = {
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: {
        family_name: "Enter last name"
    }
};
const email = {
    trim: true,
    escape: true,
    normalizeEmail: true,
    isEmail: true,
    errorMessage: {
        email: "Email must be valid"
    }
};
const password = {
    trim: true,
    escape: true,
    isLength: {
        options: { min: 8 },
        errorMessage: {
            password: "Password must have at least eight chars"
        }
    }
};
const passwordNoLength = {
    trim: true,
    escape: true,
    notEmpty: {
        errorMessage: {
            password: "Enter a password"
        }
    }
};
const confirmPassword = {
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: {
        confirmPassword: "Confirm password"
    },
    custom: {
        options: (value, { req }) => (req.body.password === value),
        errorMessage: {
            confirmPassword: "Passwords do not match"
        }
      }
};
const club_id = {
    isNumeric: true
};
const user_id = {
    isNumeric: true
};
const notification_type = {
    isIn: {
        options: [["event"],["post"]]
    }
};
const new_notification_state = {
    isBoolean: true
};



// schemas
const loginSchema = {
    email,
    password: passwordNoLength
};

const registerSchema = {
    given_name,
    family_name,
    email,
    password,
    confirmPassword
};

const notificationSchema = {
    club_id,
    notification_type,
    new_notification_state
};

const userSchema = {
    given_name,
    family_name,
    email,
    password
};



// schema exports
module.exports = {
    loginSchema,
    registerSchema,
    notificationSchema,
    userSchema
};
