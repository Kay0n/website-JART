DROP DATABASE IF EXISTS wdcproject;
CREATE DATABASE wdcproject;

USE wdcproject;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    given_name VARCHAR(255) NOT NULL,
    family_name VARCHAR(255),
    is_admin BOOLEAN NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE clubs (
    club_id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1500) NOT NULL,
    PRIMARY KEY (club_id)
);

CREATE TABLE club_memberships (
    membership_id INT AUTO_INCREMENT,
    email_notify_posts BOOLEAN NOT NULL,
    email_notify_events BOOLEAN NOT NULL,
    is_manager BOOLEAN NOT NULL,
    user_id INT NOT NULL,
    club_id INT NOT NULL,
    PRIMARY KEY (membership_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE CASCADE
);

CREATE TABLE club_posts (
    post_id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(1500) NOT NULL,
    creation_time DATETIME NOT NULL,
    is_private BOOLEAN NOT NULL,
    club_id INT NOT NULL,
    PRIMARY KEY (post_id),
    FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE CASCADE
);

CREATE TABLE club_events (
    event_id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1500) NOT NULL,
    date DATETIME NOT NULL,
    location VARCHAR(255),
    creation_time DATETIME NOT NULL,
    is_private BOOLEAN NOT NULL,
    club_id INT NOT NULL,
    PRIMARY KEY (event_id),
    FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE CASCADE
);

CREATE TABLE event_rsvps (
    rsvp_id INT AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (rsvp_id),
    FOREIGN KEY (event_id) REFERENCES club_events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



-- Mock data for testing
INSERT INTO users (email, password, given_name, family_name, is_admin) VALUES
("john@example.com", "$2b$10$VmaE9OETU3k5NrD0gOvGx./qlxhyUclDOLeJVhCcXV84NGgfirS6u", "John", "Doe", 1),        -- PASS: password123
("jane@example.com", "$2b$10$NO3UoxWhB.6RlNt8.g6GcuTX2RN7dNMNAVdT78LZ9rnKkmyn3j0KK", "Jane", "Smith", 0),      -- PASS: password456
("mike@example.com", "$2b$10$djQH9FryzdAnQEA9kQ4XgeMDal2EW5I1dAyDI2QtWb8HvEwk.Bhg6", "Mike", "Johnson", 0),    -- PASS: password789
("sarah@example.com", "$2b$10$goWZwmG6vHktWMJmVzIvsepdHzwCnCp7MKV2cuvZ6CE7/0Z6II87m", "Sarah", "Davis", 0),    -- PASS: password321
("alex@example.com", "$2b$10$SvNpqDKbI3BpmbOI2.K/WOfT9Zy24rSMezjWu1MDJ/kv9RMQYCYIO", "Alex", "Brown", 0),      -- PASS: password654
("kayon5555@gmail.com", "$2b$10$VmaE9OETU3k5NrD0gOvGx./qlxhyUclDOLeJVhCcXV84NGgfirS6u", "Jdy", "Test", 0);      -- PASS: password123


INSERT INTO clubs (name, description) VALUES
("Book Club", "A club for book enthusiasts"),
("Photography Club", "A club for photography lovers"),
("Chess Club", "A club for chess players");

INSERT INTO club_memberships (email_notify_posts, email_notify_events, is_manager, user_id, club_id) VALUES
(1, 1, 1, 1, 1),
(1, 0, 0, 2, 1),
(1, 1, 0, 3, 1),
(0, 1, 0, 4, 1),
(1, 1, 1, 2, 2),
(1, 0, 0, 3, 2),
(0, 1, 0, 4, 2),
(1, 1, 0, 5, 2),
(1, 1, 1, 1, 3),
(1, 0, 0, 3, 3),
(0, 1, 0, 4, 3),
(1, 1, 0, 6, 1);

INSERT INTO club_posts (title, content, creation_time, is_private, club_id) VALUES
("Book Recommendation", "I highly recommend reading 'The Great Gatsby' by F. Scott Fitzgerald.", NOW(), 0, 1),
("Photo Exhibition", "Join us for a photo exhibition showcasing the beauty of nature.", NOW(), 0, 2),
("Chess Tournament", "We are organizing a chess tournament next weekend. Register now!", NOW(), 0, 3),
("New Book Arrivals", "We have received some exciting new books. Check them out!", NOW(), 1, 1),
("Photography Workshop", "Learn the art of photography in our upcoming workshop.", NOW(), 0, 2),
("Chess Strategy Discussion", "Let""s discuss some interesting chess strategies this Friday.", NOW(), 0, 3);

INSERT INTO club_events (title, description, date, location, creation_time, is_private, club_id) VALUES
("Book Discussion", "Join us for a discussion on 'To Kill a Mockingbird'.", "2023-06-10 18:00:00", "Library", NOW(), 0, 1),
("Photography Walk", "Let's explore the city and capture some amazing photographs.", "2023-06-15 10:00:00", "Downtown", NOW(), 0, 2),
("Chess Simultaneous Exhibition", "Test your skills against a master chess player.", "2023-06-20 15:00:00", "Community Center", NOW(), 0, 3),
("Book Signing Event", "Meet the author of 'The Great Gatsby' and get your book signed.", "2023-06-12 14:00:00", "Bookstore", NOW(), 1, 1),
("Photography Competition", "Submit your best photographs for a chance to win exciting prizes.", "2023-06-25 09:00:00", "Online", NOW(), 0, 2),
("Chess Workshop", "Learn new chess techniques from experienced players.", "2023-06-18 16:00:00", "Chess Club", NOW(), 0, 3);

INSERT INTO event_rsvps (event_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 1),
(3, 3),
(3, 4),
(4, 1),
(5, 3),
(5, 4),
(6, 2),
(6, 3),
(6, 5);
