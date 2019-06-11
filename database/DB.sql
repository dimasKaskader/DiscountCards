DROP DATABASE IF EXISTS project_best_price_db;
DROP USER IF EXISTS 'developer'@'localhost';

CREATE DATABASE project_best_price_db;
CREATE USER 'developer'@'localhost' IDENTIFIED BY 'developer4321';
GRANT ALL PRIVILEGES ON project_best_price_db.* TO 'developer'@'localhost';

USE project_best_price_db;

DROP TABLE IF EXISTS `city`;

CREATE TABLE `city` (
  `id` int NOT NULL,
  `title` VARCHAR(32) not null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOAD DATA LOCAL INFILE 'D:/BestPrice/git/BestPriceUrFU/database/DB.sql'
INTO TABLE city CHARACTER SET utf8 FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `birth_date` date,
  `city` int NULL,
  `reg_date` date NOT NULL,
  `balance` float not null default 1000.0,
  PRIMARY KEY (`id`),
  CONSTRAINT `idUserCity` FOREIGN KEY (`city`) REFERENCES `city` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_phone`;

CREATE TABLE `user_phone` (
  `id` int NOT NULL,
  `phone_number` bigint NOT NULL,
  `uuid` varchar(32) NOT NULL UNIQUE,
  `password` char(64) NOT NULL,
  `is_cashier` boolean NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`),
  CONSTRAINT `idPhoneUser` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_web`;

CREATE TABLE `user_web` (
  `id` int NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `email` varchar(50) NULL UNIQUE,
  `is_superuser` boolean NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`),
  CONSTRAINT `idWebUser` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_event`;

CREATE TABLE `user_event` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_history_account`;

CREATE TABLE `user_history_account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NULL,
  `id_event` tinyint NOT NULL,
  `time` datetime NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `birth_date` date,
  `city` int NULL,
  `phone_number` bigint NOT NULL,
  `uuid` varchar(32) NOT NULL,
  `email` varchar(50) NULL,
  `is_superuser` boolean NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`),
  CONSTRAINT `idHistoryCity` FOREIGN KEY (`city`) REFERENCES `city` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idHistotyUser` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idHistoryEvent` FOREIGN KEY (`id_event`) REFERENCES `user_event` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `industry`;

CREATE TABLE `industry` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `id` int NOT NULL,
  `city` int NOT NULL,
  `title` varchar(30) NOT NULL,
  `logo` varchar(30) NOT NULL,
  `icon` varchar(30) NOT NULL,
  `description` varchar(200) NOT NULL,
  `id_industry` tinyint NOT NULL,
  `reg_date` date NOT NULL,
  `balance` float NOT NULL default 1000.0,
  PRIMARY KEY (`id`),
  CONSTRAINT `idCompanyCity` FOREIGN KEY (`city`) REFERENCES `city` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idCompanyUser` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idCompanyIndustry` FOREIGN KEY (`id_industry`) REFERENCES `industry` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `department`;

CREATE TABLE `department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_company` int NOT NULL,
  `street` varchar(30) NOT NULL,
  `building` varchar(6) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `idDepartmentCompany` FOREIGN KEY (`id_company`) REFERENCES `company` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `balance_payment`;

CREATE TABLE `balance_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_company` int NOT NULL,
  `payment_amount` float NOT NULL,
  `company_balance` float NOT NULL,
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `idPaymentCompany` FOREIGN KEY (`id_company`) REFERENCES `company` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `company_notification`;

CREATE TABLE `company_notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_company` int NOT NULL,
  `text` varchar(200) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `views` int NOT NULL DEFAULT 0,
  `used` int NOT NULL DEFAULT 0,
  `pushes_amount` int NOT NULL DEFAULT 0,
  `discount` float NOT NULL,
  `payment` float NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `idNotificationCompany` FOREIGN KEY (`id_company`) REFERENCES `company` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `push_notification`;

CREATE TABLE `push_notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_notification` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `idPushUser` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idPushCompany` FOREIGN KEY (`id_notification`) REFERENCES `company_notification` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `status`;

CREATE TABLE `discount_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_company` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `threshold_sum` float NOT NULL,
  `discount` float NOT NULL,
  `is_offer` boolean DEFAULT false,
  PRIMARY KEY (`id`),
  CONSTRAINT `idStatusCompany` FOREIGN KEY (`id_company`) REFERENCES `company` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cashier`;

CREATE TABLE `cashier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_company` int NOT NULL,
  `is_confirmed` boolean NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `idCashierUser` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idCashierCompany` FOREIGN KEY (`id_company`) REFERENCES `company` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_discount`;

CREATE TABLE `user_discount` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_status` int NOT NULL,
  `id_company` int NOT NULL,
  
  PRIMARY KEY (`id`),
  CONSTRAINT `idCardUser` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idCardCompany` FOREIGN KEY (`id_company`) REFERENCES `company` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idCardStatus` FOREIGN KEY (`id_status`) REFERENCES `discount_status` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_history_purchases`;

CREATE TABLE `user_history_purchases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_company` int NOT NULL,
  `id_discount` int NULL,
  `id_cashier` int NOT NULL,
  `purchase_time` datetime NOT NULL,
  `price` float NOT NULL,
  `user_balance` float NOT NULL,
  `company_balance` float NOT NULL,
  `push_notification` int null,
  PRIMARY KEY (`id`),
  CONSTRAINT `idPurchasesPush` FOREIGN KEY (`push_notification`) REFERENCES `company_notification` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idPurchasesCashier` FOREIGN KEY (`id_cashier`) REFERENCES `cashier` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idPurchasesDiscount` FOREIGN KEY (`id_discount`) REFERENCES `discount_status` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idPurchasesUser` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `idPurchasesCompany` FOREIGN KEY (`id_company`) REFERENCES `company` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
