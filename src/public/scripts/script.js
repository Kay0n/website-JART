

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



const postApp = VueInstance.createApp({
    data() {
        return {
            title: "",
            content: "",
            is_private: ""
        };
    },
    methods: {
        async submitForm() {
            const urlParams = new URLSearchParams(window.location.search);
            const queryData = urlParams.get('club_id');
            const postData = await fetch("/query/add_post?club_id=" + queryData, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: this.title,
                    content: this.content,
                    is_private: this.is_private
                })
            });
            console.log(postData);
        }
    }
});

const eventAPP = VueInstance.createApp({
    data() {
        return {
            title: "",
            description: "",
            date: "",
            location: "",
            is_private: ""
        };
    },
    methods: {
        async submitForm() {
            const urlParams = new URLSearchParams(window.location.search);
            const queryData = urlParams.get('club_id');
            const eventData = await fetch("/query/add_event?club_id=" + queryData, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: this.title,
                    description: this.description,
                    date: this.date,
                    location: this.location,
                    is_private: this.is_private
                })
            });
            console.log(eventData);
        }
    }
});

const addClubApp = VueInstance.createApp({
    data() {
        return {
            name: "",
            description: ""
        };
    },
    methods: {
        async submitForm() {
            const clubData = await fetch("/query/add_club", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: this.name,
                    description: this.description
                })
            });
            console.log(clubData);
        }
    }
});

const deleteClubApp = VueInstance.createApp({
    methods: {
        async deleteClub() {
            const urlParams = new URLSearchParams(window.location.search);
            const queryData = urlParams.get('club_id');
            const response = await fetch("/query/delete_club?club_id=" + queryData, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                })
            });

            if (response.ok) {
                // Club deletion was successful
                console.log("Club deleted successfully.");
            } else {
                // Handle any errors or unsuccessful deletion
                console.error("Failed to delete club.");
        }
    }}
});

const userSettingsApp = VueInstance.createApp({
    data() {
        return {
            name: "",
            email: "",
        };
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

function goToClubSettings() {
    window.location.href = "/pages/clubSettings";
}

loginApp.mount("#login-form");
registerApp.mount("#register-form");



eventAPP.mount("#add-event");
postApp.mount("#add-post");
addClubApp.mount("#add-club");
deleteClubApp.mount("#delete-club");
