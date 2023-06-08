

// pieces of schema that can be reused
const schemas = {
    given_name: {
        trim: true,
        escape: true,
        notEmpty: true,
        errorMessage: {
            given_name: "Enter first name"
        }
    },
    family_name: {
        trim: true,
        escape: true,
        notEmpty: true,
        errorMessage: {
            family_name: "Enter last name"
        }
    },
    email: {
        trim: true,
        escape: true,
        normalizeEmail: true,
        isEmail: true,
        errorMessage: {
            email: "Email must be valid"
        }
    },
    password: {
        trim: true,
        escape: true,
        isLength: {
            options: { min: 8 },
            errorMessage: {
                password: "Password must have at least eight chars"
            }
        }
    },
    passwordOptional: {
        optional: true,
        trim: true,
        escape: true,
        isLength: {
            options: { min: 8 },
            errorMessage: {
                password: "Password must have at least eight chars"
            }
        }
    },
    passwordNoLength: {
        trim: true,
        escape: true,
        notEmpty: {
            errorMessage: {
                password: "Enter a password"
            }
        }
    },
    confirmPassword: {
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
    },
    club_id: {
        isNumeric: true
    },
    user_id: {
        isNumeric: true
    },
    email_notify_posts: {
        isBoolean: true
    },
    email_notify_events: {
        isBoolean: true
    },
    title: {
        trim: true,
        escape: true,
        notEmpty: true,
        errorMessage: {
            title: "This field is required"
        }
    },
    description: {
        trim: true,
        escape: true,
        notEmpty: true,
        errorMessage: {
            description: "This field is required"
        }
    },
    date: {
        toDate: true,
        errorMessage: {
            title: "A date is required"
        }
    },
    is_private: {
        isBoolean: true
    },
    location: {
        isString: true
    }

};



// schema exports
module.exports = schemas;
