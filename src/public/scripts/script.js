

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




const allClubsApp = VueInstance.createApp({
    data() {
        return {
            clubs: [],
            clubsPerRow: 3
        };
    },
    computed: {
        dividedObjects() {
          const chunks = [];
          for (let i = 0; i < this.clubs.length; i += this.clubsPerRow) {
            chunks.push(this.clubs.slice(i, i + this.clubsPerRow));
          }
          return chunks;
        }
    },
    async mounted() {
        const response = await fetch("/query/get_clubs", {});
        this.clubs = await response.json();
    }
});

const clubNameApp = VueInstance.createApp({
    data() {
        return {
            club_name: ""
        };
    },
    async mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const queryData = urlParams.get('club_id');
        const response = await fetch("/query/get_club_name?club_id=" + queryData, {});
        const clubData = await response.json();
        this.club_name = clubData[0].name;

    }
});




const allPublicPostsApp = VueInstance.createApp({
    data() {
        return {
            all_public_posts: [],
            postsPerRow: 3
        };
    },
    computed: {
        dividedObjects() {
          const chunks = [];
          for (let i = 0; i < this.all_public_posts.length; i += this.postsPerRow) {
            chunks.push(this.all_public_posts.slice(i, i + this.postsPerRow));
          }
          return chunks;
        }
    },
    async mounted() {
        const response = await fetch("/query/get_all_public_posts", {});
        this.all_public_posts = await response.json();
    },
    methods: {
        redirectToClub(item){
            var clubId = item.club_id;
            var url = '/pages/club?club_id=' + clubId;
            window.location.href = url;
        }
    }
});

const publicPostsApp = VueInstance.createApp({
    data() {
        return {
            public_posts: []
        };
    },
    async mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const queryData = urlParams.get('club_id');
        const response = await fetch("/query/get_public_posts?club_id=" + queryData, {});
        this.public_posts = await response.json();
    }
});

const subscribedPostsApp = VueInstance.createApp({
    data() {
        return {
            subscribed_posts: []
        };
    },
    async mounted() {
        const response = await fetch("/query/get_subscribed_club_posts", {});
        this.subscribed_posts = await response.json();
    }
});

const clubPostsApp = VueInstance.createApp({
    data() {
        return {
            club_posts: []
        };
    },
    async mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const queryData = urlParams.get('club_id');
        const response = await fetch("/query/get_club_posts?club_id=" + queryData, {});
        this.club_posts = await response.json();
    }
});



const allPublicEventsApp = VueInstance.createApp({
    data() {
        return {
            all_public_events: [],
            eventsPerRow: 3
        };
    },
    computed: {
        dividedObjects() {
          const chunks = [];
          for (let i = 0; i < this.all_public_events.length; i += this.eventsPerRow) {
            chunks.push(this.all_public_events.slice(i, i + this.eventsPerRow));
          }
          return chunks;
        }
    },
    async mounted() {
        const response = await fetch("/query/get_all_public_events", {});
        this.all_public_events = await response.json();
    },
    methods: {
        addRSVP(event_id){
            fetch("/query/add_RSVP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: event_id,
                })
            });
        }
    }
});

const publicEventsApp = VueInstance.createApp({
    data() {
        return {
            public_events: []
        };
    },
    async mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const queryData = urlParams.get('club_id');
        const response = await fetch("/query/get_public_events?club_id=" + queryData, {});
        this.public_events = await response.json();
    }
});

const subscribedEventsApp = VueInstance.createApp({
    data() {
        return {
            subscribed_events: []
        };
    },
    async mounted() {
        const response = await fetch("/query/get_subscribed_club_events", {});
        this.subscribed_events = await response.json();
    },
    methods: {
        addRSVP(event_id){
            fetch("/query/add_RSVP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: event_id,
                })
            });
        }
    }
});

const clubEventsApp = VueInstance.createApp({
    data() {
        return {
            club_events: []
        };
    },
    async mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const queryData = urlParams.get('club_id');
        const response = await fetch("/query/get_club_events?club_id=" + queryData, {});
        this.club_events = await response.json();
    },
    methods: {
        addRSVP(event_id){
            fetch("/query/add_RSVP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: event_id,
                })
            });
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
            given_name: "",
            family_name: "",
            email: "",
            password: "",
            user_object: {}
        };
    },
    mounted() {
        this.getUserData();
    },
    methods: {
        getUserData() {
            fetch("/query/get_user", {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.user_object = data;
            this.given_name = data.given_name;
            this.family_name = data.family_name;
            this.email = data.email;
        });
        },
        async submitForm() {
            const userSettings = await fetch("/query/update_user_settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    given_name: this.given_name,
                    family_name: this.family_name,
                    email: this.email,
                    password: this.password,
                })
            });
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

function goToClubSettings() {
    window.location.href = "/pages/clubSettings";
}

loginApp.mount("#login-form");
registerApp.mount("#register-form");

allClubsApp.mount("#all-clubs");
clubNameApp.mount("#club-name");

allPublicPostsApp.mount("#all-public-posts");
publicPostsApp.mount("#public-posts");
subscribedPostsApp.mount("#subscribed-posts");
clubPostsApp.mount("#club-posts");

allPublicEventsApp.mount("#all-public-events");
publicEventsApp.mount("#public-events");
subscribedEventsApp.mount("#subscribed-events");
clubEventsApp.mount("#club-events");

eventAPP.mount("#add-event");
postApp.mount("#add-post");
addClubApp.mount("#add-club");
deleteClubApp.mount("#delete-club");
userSettingsApp.mount("#user-settings");
