

// @ts-ignore
// eslint-disable-next-line , no-undef
const VueInstance = Vue;



const loginApp = VueInstance.createApp({
    data() {
        return {
            email: "",
            password: "",
            errorMessages: []
        };
    },
    methods: {
        hasError(field) {
            return this.errorMessages.some((msg) => msg[field]);
        },

        getErrorMessage(field) {
            const errorObj = this.errorMessages.find((msg) => msg[field]);
            return errorObj ? errorObj[field] : "";
        },

        async submitForm() {

            const formBody = {
                email: this.email,
                password: this.password
            };

            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formBody)
            });

            if(response.ok){
                window.location.href = "/";
                return;
            }

            const errorMessagesArray = (await response.json()).errorMessages;
            this.errorMessages = errorMessagesArray;
        }
    }
});



const registerApp = VueInstance.createApp({
    data() {
        return {
            given_name: "",
            family_name: "",
            email: "",
            password: "",
            confirmPassword: "",
            errorMessages: []
        };
    },
    methods: {
        hasError(field) {
            return this.errorMessages.some((msg) => msg[field]);
        },

        getErrorMessage(field) {
            const errorObj = this.errorMessages.find((msg) => msg[field]);
            return errorObj ? errorObj[field] : "";
        },

        async submitForm() {


            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    given_name: this.given_name,
                    family_name: this.family_name,
                    email: this.email,
                    password: this.password,
                    confirmPassword: this.confirmPassword
                })
            });

            if(response.ok){
                window.location.href = "/";
                return;
            }

            const errorMessagesArray = (await response.json()).errorMessages;
            this.errorMessages = errorMessagesArray;

        }
    }
});

function redirectToLoginPage() {
    window.location.href = "/login";
}

function goToSettingsPage() {
    window.location.href = "/pages/userSettings";
}

function goToExplorePage() {
    window.location.href = "/pages/explore";
}

function goToMyClubs() {
    window.location.href = "/pages/myClubs";
}

loginApp.mount("#login-form");
registerApp.mount("#register-form");
