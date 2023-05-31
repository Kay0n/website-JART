
// This file exists to extend the Express.User type for passport.js user serialization
// it is only relevant for intellisence and debugging, please ignore

export {}
declare global {
    namespace Express {
        interface User {
            user_id: number;
            email: string;
            password: string;
            given_name: string;
            family_name: string;
            is_admin: boolean;
        }
    }
    interface database{
        test: string;
    }
}