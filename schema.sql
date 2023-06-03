-- DROP DATABASE IF EXISTS wdcproject;
-- CREATE DATABASE wdcproject;

-- USE wdcproject;

-- CREATE TABLE users (
--     user_id INT PRIMARY KEY AUTO_INCREMENT,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255),
--     given_name VARCHAR(255) NOT NULL,
--     family_name VARCHAR(255),
--     is_admin BOOLEAN NOT NULL
--     -- alt_signin_id VARCHAR(255) UNIQUE -- dont think this is necessary, will investigate in future
-- );

-- CREATE TABLE clubs (
--     club_id INT PRIMARY KEY AUTO_INCREMENT,
--     name VARCHAR(255) NOT NULL UNIQUE,
--     description VARCHAR(1500) NOT NULL,
--     number_members INT NOT NULL
-- );

-- CREATE TABLE club_memberships (
--     membership_id INT PRIMARY KEY AUTO_INCREMENT,
--     email_notify_posts BOOLEAN NOT NULL,
--     email_notify_events BOOLEAN NOT NULL,
--     user_id INT NOT NULL,
--     club_id INT NOT NULL,
--     is_manager BOOLEAN NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES users(user_id),
--     FOREIGN KEY (club_id) REFERENCES clubs(club_id)
-- );

-- CREATE TABLE club_posts (
--     post_id INT PRIMARY KEY AUTO_INCREMENT,
--     club_id INT NOT NULL,
--     title VARCHAR(255) NOT NULL,
--     content VARCHAR(1500) NOT NULL,
--     creation_time DATETIME NOT NULL,
--     is_private BOOLEAN NOT NULL,
--     FOREIGN KEY (club_id) REFERENCES clubs(club_id)
-- );

-- CREATE TABLE club_events (
--     event_id INT PRIMARY KEY AUTO_INCREMENT,
--     club_id INT NOT NULL,
--     title VARCHAR(255) NOT NULL,
--     edescription VARCHAR(1500) NOT NULL,
--     date DATETIME NOT NULL,
--     location VARCHAR(255) NOT NULL,
--     creation_time DATETIME NOT NULL,
--     is_private BOOLEAN NOT NULL,
--     FOREIGN KEY (club_id) REFERENCES clubs(club_id)
-- );

-- CREATE TABLE event_rsvps (
--     rsvp_id INT PRIMARY KEY AUTO_INCREMENT,
--     event_id INT NOT NULL,
--     user_id INT NOT NULL,
--     FOREIGN KEY (event_id) REFERENCES club_events(event_id),
--     FOREIGN KEY (user_id) REFERENCES users(user_id)
-- );


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
    -- alt_signin_id VARCHAR(255) UNIQUE -- dont think this is necessary, will investigate in future
    PRIMARY KEY (user_id)
);

CREATE TABLE clubs (
    club_id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1500) NOT NULL,
    number_members INT NOT NULL,
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