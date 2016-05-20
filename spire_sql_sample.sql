-- phpMyAdmin SQL Dump
-- version 4.0.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 20, 2016 at 09:40 AM
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
  `id` int(11) NOT NULL DEFAULT '0',
  `test_id` bigint(8) NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `test_date` datetime NOT NULL,
  `content_id` varchar(255) NOT NULL,
  `content_title` varbinary(255) NOT NULL,
  `content_error` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `manifest_tests`
--

CREATE TABLE `manifest_tests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `test_id` bigint(8) NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `test_date` datetime NOT NULL,
  `expected_key` varchar(255) NOT NULL,
  `expected_value` text NOT NULL,
  `live_key` varchar(255) NOT NULL,
  `live_value` text NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `nav_tests`
--

CREATE TABLE `nav_tests` (
  `id` int(11) NOT NULL DEFAULT '0',
  `test_id` bigint(8) NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `test_date` datetime NOT NULL,
  `link_name` varchar(255) NOT NULL,
  `link_url` text NOT NULL,
  `status_code` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `test_id`
--

CREATE TABLE `test_id` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `test_id` bigint(8) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `api_key` varchar(32) NOT NULL,
  `status` int(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `api_key`, `status`, `created_at`) VALUES
(1, 'Deltrie Allen', 'deltrie.allen@nbcuni.com', '$2a$10$4d0792e11407225cfb589utBSVRWsJw0Ls9sKJzNM0P/nk10yaI6m', 'de5cb1fd204d20b77af22cd4d6ff4606', 1, '2016-05-19 18:23:19'),
(3, 'Deltrie Allen', 'deltrie.allenw@nbcuni.com', '$2a$10$1ad87e6cc07a9b307c610u/CWRnXATcORu4dal0QL3PMJzitTyN0.', 'c82f6a7f294df566050c0669942cb7ed', 1, '2016-05-19 18:26:22');
