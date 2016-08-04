-- phpMyAdmin SQL Dump
-- version 4.0.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 04, 2016 at 11:42 AM
-- Server version: 5.5.33
-- PHP Version: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `ots_spire`
--

-- --------------------------------------------------------

--
-- Table structure for table `article_tests`
--

CREATE TABLE `article_tests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `test_id` bigint(8) NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `content_id` varchar(255) NOT NULL,
  `content_title` varbinary(255) NOT NULL,
  `content_error` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `manifest_tests`
--

CREATE TABLE `manifest_tests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `test_id` bigint(8) NOT NULL,
  `apiVersion` varchar(255) NOT NULL,
  `expected_key` varchar(255) NOT NULL,
  `expected_value` text NOT NULL,
  `live_key` varchar(255) NOT NULL,
  `live_value` text NOT NULL,
  `status` varchar(255) NOT NULL,
  `info` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `nav_tests`
--

CREATE TABLE `nav_tests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `test_id` bigint(8) NOT NULL,
  `link_name` varchar(255) NOT NULL,
  `link_url` text NOT NULL,
  `status_code` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `call_letters` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `shortname` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `api_version` int(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=27 ;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `call_letters`, `brand`, `shortname`, `url`, `group`, `api_version`) VALUES
(1, 'WNBC', 'NBC New York', 'nbcnewyork', 'http://www.nbcnewyork.com', 'OTS', 3),
(2, 'KNBC', 'NBC Los Angeles', 'nbclosangeles', 'http://www.nbclosangeles.com', 'OTS', 3),
(3, 'WMAQ', 'NBC Chicago', 'nbcchicago', 'http://www.nbcchicago.com', 'OTS', 3),
(4, 'KNTV', 'NBC Bay Area', 'nbcbayarea', 'http://www.nbcbayarea.com', 'OTS', 3),
(5, 'KXAS', 'NBC Dallas-For Worth', 'nbcdfw', 'http://www.nbcdfw.com', 'OTS', 3),
(6, 'WTVJ', 'NBC Miami', 'nbcmiami', 'http://www.nbcmiami.com', 'OTS', 3),
(7, 'WCAU', 'NBC Philadelphia', 'nbcphiladelphia', 'http://www.nbcphiladelphia.com', 'OTS', 3),
(8, 'WVIT', 'NBC Connecticut', 'nbcconnecticut', 'http://www.nbcconnecticut.com', 'OTS', 3),
(9, 'WRC', 'NBC Washington', 'nbcwashington', 'http://www.nbcwashington.com', 'OTS', 3),
(10, 'KNTV', 'NBC San Diego', 'nbcsandiego', 'http://www.nbcsandiego.com', 'OTS', 3),
(11, 'NECN', 'NECN', 'necn', 'http://www.necn.com', 'OTS', 3),
(12, 'KTLM', 'Telemundo McAllen', 'telemundo40', 'http://www.telemundo40.com', 'TSG', 3),
(13, 'WNJU', 'Telemundo 47', 'telemundo47', 'http://www.telemundo47.com', 'TSG', 3),
(14, 'WSCV', 'Telemundo Miami', 'telemundo51', 'http://www.telemundo51.com', 'TSG', 3),
(15, 'KVEA', 'Telemundo Los Angels', 'telemundo52', 'http://www.telemundo52.com', 'TSG', 3),
(16, 'WWSI', 'Telemundo Philadelpia', 'telemundo62', 'http://www.telemundo62.com', 'TSG', 3),
(17, 'KSTS', 'Telemundo Area De La Bahia', 'telemundoareadelabahia', 'http://www.telemundoareadelabahia.com', 'TSG', 3),
(18, 'KTAZ', 'Telemundo Arizona', 'telemundoarizona', 'http://www.telemundoarizona.com', 'TSG', 3),
(19, 'WNEU', 'Telemundo Boston', 'telemundoboston', 'http://www.telemundoboston.com', 'TSG', 3),
(20, 'WSNS', 'Telemundo', 'telemundochicago', 'http://www.telemundochicago.com', 'TSG', 3),
(21, 'KXTX', 'Telemundo Dallas', 'telemundodallas', 'http://www.telemundodallas.com', 'TSG', 3),
(22, 'KDEN', 'Telemundo Denver', 'telemundodenver', 'http://www.telemundodenver.com', 'TSG', 3),
(23, 'KTMD', 'Telemundo Houston', 'telemundohouston', 'http://www.telemundohouston.com', 'TSG', 3),
(24, 'KBLR', 'Telemundo Las Vegas', 'telemundolasvegas', 'http://www.telemundolasvegas.com', 'TSG', 3),
(25, 'KVDA', 'Telemundo San Antonio', 'telemundosanantonio', 'http://www.telemundosanantonio.com', 'TSG', 3),
(26, 'WKAQ', 'Telemundo PR', 'telemundopr', 'http://www.telemundopr.com', 'TSG', 3);

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `test_id` bigint(8) NOT NULL,
  `property` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `api_key` varchar(32) NOT NULL,
  `status` int(4) NOT NULL,
  `role` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `api_key`, `status`, `role`, `created_at`) VALUES
(1, 'Deltrie', 'Allen', 'deltrie.allen@nbcuni.com', '$2a$10$52ee664fcf7ce5d48bc89O9kCCUeMMs268GXuQmmYoQSk9fBiitQy', '31d6440532e72c5882e90baa3e820eca', 1, 0, '2016-06-14 20:42:26'),
(2, 'Deltrie', 'Allen', 'deltrie.allen@gmail.com', '$2a$10$f8fa35b9b6dc58aabc961OqTS7IDCHxaYIlRzQ/0rmUA7dFck3Gvu', '1f98d1d23c07f2d7743f6d8058b42ade', 1, 3, '2016-07-06 17:17:08'),
(3, 'Christian', 'Puma', 'christian.puma@nbcuni.com', '$2a$10$abd986c4d4758dc2a2a71uDrgChd482kTn9du7iELbDxq0BjHA4ry', '22cf520343e24f05e3d1683c1fbaa3b5', 1, 0, '2016-07-07 19:22:35'),
(4, 'David', 'Reyes', 'david.reyes1@nbcuni.com', '$2a$10$9f2c567bf0f2a351f15efOqJ6g3lptx5itZKsN11qYO6N.HK32F6G', 'a39fbe6bbb1f03309f48756895288544', 1, 1, '2016-07-07 19:23:34'),
(5, 'Justin', 'Sevilla', 'justin.sevilla@nbcuni.com', '$2a$10$0a172fa639693cab53bcbO9ig0Jnt1zylLXCBJUSDq/.YqEaSGEZq', 'e2d6e997f04fa772a9ad69cd8e2a406a', 1, 3, '2016-07-07 19:24:09'),
(6, 'JoAnne', 'McGuffie', 'joanne.mcguffie@nbcuni.com', '$2a$10$ab0cfc7c684e76a8dec86ufmkt7Lm88tMCK5qAFaNSfkVPF9AZ2si', 'd1213dee13cdec11087340dc7be4bbdd', 1, 3, '2016-07-07 19:25:34'),
(7, 'Fausto', 'Abreu', 'fausto.abreu@nbcuni.com', '$2a$10$483ef4c39ffcfd659cddaeJQLEWUNKVN9Kl9Nq9MmB9eos/iAPLTG', '8938d345b4eb168b32ca9c279d4e75b0', 1, 4, '2016-07-07 19:26:00'),
(8, 'Sebastian', 'DiFrancesca', 'sebastian.difrancesc@nbcuni.com', '$2a$10$8f296a8c4328df7e66fa0OMg8.wpY/mJJoO7ChjD7fpjpWnGBHFJa', 'b25439f649cffea7709aa7e6d7ce3646', 1, 4, '2016-07-07 19:26:29'),
(9, 'Navjendar', 'Ghotra', 'navjendar.ghotra@nbcuni.com', '$2a$10$b4339e082fc247cac41a2OT7wcTpygSIE9OfPkbgdEfAaJFzV7Rou', '1b46b93ad89bbee7306b3b9dbcb4e0f4', 1, 4, '2016-07-07 19:27:18'),
(10, 'Eduardo', 'Martinez', 'eduardo.martinez@nbcuni.com', '$2a$10$c7157c1bba829983ec531eZooG8PEL3N81OHSN6xCctxhcj0Mz7SC', 'b51b83b118b413fae95d9adbb63e1ce4', 1, 1, '2016-07-07 19:28:29'),
(11, 'Toby', 'Spinks', 'toby.spinks@nbcuni.com', '$2a$10$c14552dc5bf049f313736uL1VOtlO67fQVqCyPwToNgz6HEGdAvrO', 'd04177ab6b9e429a474cafb368b51d83', 1, 1, '2016-07-07 19:28:43'),
(12, 'Benjamin', 'Sevilla', 'benjamin.sevilla@nbcuni.com', '$2a$10$46daa3a991903f3aa4855umxhNhvqvvaWr/zKpLqqHTK8xNjV6ap2', '95b3bceb880684c145fab6a87ec7a30e', 1, 4, '2016-07-07 19:30:45');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `role` int(4) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `role`, `role_name`) VALUES
(1, 0, 'admin'),
(2, 1, 'manager'),
(3, 2, 'developer'),
(4, 3, 'operations'),
(5, 4, 'user\r\n');
