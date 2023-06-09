-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: wdcproject
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `wdcproject`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `wdcproject` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `wdcproject`;

--
-- Table structure for table `club_events`
--

DROP TABLE IF EXISTS `club_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1500) NOT NULL,
  `date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `creation_time` datetime NOT NULL,
  `is_private` tinyint(1) NOT NULL,
  `club_id` int NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_events_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_events`
--

LOCK TABLES `club_events` WRITE;
/*!40000 ALTER TABLE `club_events` DISABLE KEYS */;
INSERT INTO `club_events` VALUES (1,'Book Discussion','Join us for a discussion on \'To Kill a Mockingbird\'.','2023-06-10 18:00:00','Library','2023-06-09 13:35:45',0,1),(2,'Photography Walk','Let\'s explore the city and capture some amazing photographs.','2023-06-15 10:00:00','Downtown','2023-06-09 13:35:45',0,2),(3,'Chess Simultaneous Exhibition','Test your skills against a master chess player.','2023-06-20 15:00:00','Community Center','2023-06-09 13:35:45',0,3),(4,'Book Signing Event','Meet the author of \'The Great Gatsby\' and get your book signed.','2023-06-12 14:00:00','Bookstore','2023-06-09 13:35:45',1,1),(5,'Photography Competition','Submit your best photographs for a chance to win exciting prizes.','2023-06-25 09:00:00','Online','2023-06-09 13:35:45',0,2),(6,'Chess Workshop','Learn new chess techniques from experienced players.','2023-06-18 16:00:00','Chess Club','2023-06-09 13:35:45',0,3);
/*!40000 ALTER TABLE `club_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_memberships`
--

DROP TABLE IF EXISTS `club_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_memberships` (
  `membership_id` int NOT NULL AUTO_INCREMENT,
  `email_notify_posts` tinyint(1) NOT NULL,
  `email_notify_events` tinyint(1) NOT NULL,
  `is_manager` tinyint(1) NOT NULL,
  `user_id` int NOT NULL,
  `club_id` int NOT NULL,
  PRIMARY KEY (`membership_id`),
  KEY `user_id` (`user_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_memberships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `club_memberships_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_memberships`
--

LOCK TABLES `club_memberships` WRITE;
/*!40000 ALTER TABLE `club_memberships` DISABLE KEYS */;
INSERT INTO `club_memberships` VALUES (1,1,1,1,1,1),(2,1,0,0,2,1),(3,1,1,0,3,1),(4,0,1,0,4,1),(5,1,1,1,2,2),(6,1,0,0,3,2),(7,0,1,0,4,2),(8,1,1,0,5,2),(9,1,1,1,1,3),(10,1,0,0,3,3),(11,0,1,0,4,3),(12,1,1,0,6,1);
/*!40000 ALTER TABLE `club_memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_posts`
--

DROP TABLE IF EXISTS `club_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` varchar(1500) NOT NULL,
  `creation_time` datetime NOT NULL,
  `is_private` tinyint(1) NOT NULL,
  `club_id` int NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_posts_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_posts`
--

LOCK TABLES `club_posts` WRITE;
/*!40000 ALTER TABLE `club_posts` DISABLE KEYS */;
INSERT INTO `club_posts` VALUES (1,'Book Recommendation','I highly recommend reading \'The Great Gatsby\' by F. Scott Fitzgerald.','2023-06-09 13:35:45',0,1),(2,'Photo Exhibition','Join us for a photo exhibition showcasing the beauty of nature.','2023-06-09 13:35:45',0,2),(3,'Chess Tournament','We are organizing a chess tournament next weekend. Register now!','2023-06-09 13:35:45',0,3),(4,'New Book Arrivals','We have received some exciting new books. Check them out!','2023-06-09 13:35:45',1,1),(5,'Photography Workshop','Learn the art of photography in our upcoming workshop.','2023-06-09 13:35:45',0,2),(6,'Chess Strategy Discussion','Let\"s discuss some interesting chess strategies this Friday.','2023-06-09 13:35:45',0,3);
/*!40000 ALTER TABLE `club_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubs` (
  `club_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(1500) NOT NULL,
  PRIMARY KEY (`club_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubs`
--

LOCK TABLES `clubs` WRITE;
/*!40000 ALTER TABLE `clubs` DISABLE KEYS */;
INSERT INTO `clubs` VALUES (1,'Book Club','A club for book enthusiasts'),(2,'Photography Club','A club for photography lovers'),(3,'Chess Club','A club for chess players');
/*!40000 ALTER TABLE `clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_rsvps`
--

DROP TABLE IF EXISTS `event_rsvps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_rsvps` (
  `rsvp_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`rsvp_id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `event_rsvps_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `club_events` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `event_rsvps_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (1,1,1),(2,1,2),(3,2,2),(4,2,3),(5,3,1),(6,3,3),(7,3,4),(8,4,1),(9,5,3),(10,5,4),(11,6,2),(12,6,3),(13,6,5);
/*!40000 ALTER TABLE `event_rsvps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `given_name` varchar(255) NOT NULL,
  `family_name` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john@example.com','$2b$10$VmaE9OETU3k5NrD0gOvGx./qlxhyUclDOLeJVhCcXV84NGgfirS6u','John','Doe',1),(2,'jane@example.com','$2b$10$NO3UoxWhB.6RlNt8.g6GcuTX2RN7dNMNAVdT78LZ9rnKkmyn3j0KK','Jane','Smith',0),(3,'mike@example.com','$2b$10$djQH9FryzdAnQEA9kQ4XgeMDal2EW5I1dAyDI2QtWb8HvEwk.Bhg6','Mike','Johnson',0),(4,'sarah@example.com','$2b$10$goWZwmG6vHktWMJmVzIvsepdHzwCnCp7MKV2cuvZ6CE7/0Z6II87m','Sarah','Davis',0),(5,'alex@example.com','$2b$10$SvNpqDKbI3BpmbOI2.K/WOfT9Zy24rSMezjWu1MDJ/kv9RMQYCYIO','Alex','Brown',0),(6,'kayon5555@gmail.com','$2b$10$VmaE9OETU3k5NrD0gOvGx./qlxhyUclDOLeJVhCcXV84NGgfirS6u','Jdy','Test',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-09 13:38:31
