

// fake database for testing purposes
let userTable = [];
let userIDTracker = 0;




// mock database search
const getUser = (value, property) => {
    for (const user of userTable) {
        if (user[property] === value) {
        return user;
        }
    }
    return null;
};

// mock database add
const addUser = (email, password, fName, lName, googleID) => {
    const newUser = {
        id: userIDTracker,
        email: email,
        password: password,
        first_name: fName,
        last_name: lName,
        alt_signin_id: googleID
    };
    userTable.push(newUser);
    userIDTracker++;
};

// mock database delete
const deleteUser = (userID) => {
    for (let i = 0; i < userTable.length; i++) {
        if (userTable.at(i).id === userID) {
            userTable.splice(i, 1);
            return true;
        }
    }
    return false;
};

// add initial elements to array
addUser("test@test.com", "test", "Bob", "Marley");
addUser("w@w", "w", "WF", "WL");
addUser("kayon5555@gmail.com", undefined, "J", "Moore", "114581141548205108663");


module.exports = { getUser, addUser, deleteUser };
