
const login = {
    email: {
        isEmail: true,
        errorMessage: 'Invalid email'
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 chars'
        }
    }
};



const register = {

};



module.exports = { login, register };
