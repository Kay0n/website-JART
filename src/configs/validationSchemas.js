

const loginSchema = {
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
        notEmpty: {
            errorMessage: {
                password: "Enter a password"
            }
        }
    }
};

const registerSchema = {
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
    confirmPassword: {
        trim: true,
        escape: true,
        notEmpty: true,
        errorMessage: {
            confirmPassword: "Confirm password"
        }
    }
};





module.exports = { loginSchema, registerSchema };
