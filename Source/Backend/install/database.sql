-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 13, 2021 at 04:49 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `galyon`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `uid` varchar(36) DEFAULT NULL,
  `store_id` varchar(36) DEFAULT NULL,
  `type` enum('home','work','other') NOT NULL DEFAULT 'home',
  `address` text NOT NULL COMMENT 'from Google',
  `house` text NOT NULL COMMENT 'from User',
  `landmark` varchar(200) NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `lat` varchar(100) NOT NULL,
  `lng` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `cover` text NOT NULL,
  `message` text NOT NULL,
  `link` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `position` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `store_id` varchar(36) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `cover` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `chat_message`
--

CREATE TABLE `chat_message` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `uid` varchar(36) DEFAULT NULL,
  `to_uid` varchar(36) DEFAULT NULL,
  `room_id` varchar(36) DEFAULT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `chat_room`
--

CREATE TABLE `chat_room` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `uid` varchar(36) DEFAULT NULL,
  `participants` text NOT NULL COMMENT 'arrays of uid''s',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `name` text NOT NULL,
  `lat` text NOT NULL,
  `lng` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ci_sessions`
--

CREATE TABLE `ci_sessions` (
  `id` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `timestamp` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `data` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favourite`
--

CREATE TABLE `favourite` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(36) DEFAULT NULL,
  `pid_lists` text NOT NULL,
  `sid_lists` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `feeds`
--

CREATE TABLE `feeds` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(36) NOT NULL,
  `tag_uid` text NOT NULL COMMENT 'user tagged',
  `content` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `feeds_comments`
--

CREATE TABLE `feeds_comments` (
  `id` bigint(20) NOT NULL,
  `fid` varchar(36) DEFAULT NULL,
  `uid` varchar(36) DEFAULT NULL,
  `reaction` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `feeds_reacts`
--

CREATE TABLE `feeds_reacts` (
  `id` bigint(20) NOT NULL,
  `fid` varchar(36) DEFAULT NULL,
  `uid` varchar(36) DEFAULT NULL,
  `reaction` enum('1','2','3','4','5') NOT NULL COMMENT 'like, laugh, wow, heart, angry',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `url` text NOT NULL,
  `agent` text NOT NULL,
  `datetime` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `version` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `descriptions` text NOT NULL,
  `image` text NOT NULL,
  `type` enum('notset','percent','fixed','delivery') NOT NULL DEFAULT 'notset',
  `off` decimal(20,2) NOT NULL,
  `min` decimal(20,2) NOT NULL,
  `upto` decimal(20,2) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `expired_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `uid` varchar(36) DEFAULT NULL,
  `address_id` varchar(36) DEFAULT NULL,
  `store_id` varchar(36) DEFAULT NULL COMMENT 'multi',
  `driver_id` varchar(36) DEFAULT NULL COMMENT 'multi',
  `items` mediumtext NOT NULL,
  `notes` mediumtext NOT NULL,
  `extra` mediumtext NOT NULL,
  `assignee` text NOT NULL,
  `total` decimal(20,2) NOT NULL,
  `coupon_code` varchar(20) NOT NULL,
  `delivery_charge` decimal(20,2) NOT NULL,
  `discount` decimal(20,2) NOT NULL,
  `tax` decimal(20,2) NOT NULL,
  `grand_total` decimal(20,2) NOT NULL,
  `paid_method` text NOT NULL,
  `pay_key` text NOT NULL,
  `status` enum('created','accepted','ongoing','picked','rejected','cancelled','delivered','refund') NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `id` bigint(20) NOT NULL,
  `otp` varchar(20) NOT NULL,
  `contact` varchar(200) NOT NULL COMMENT 'email / phone',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `ukey` varchar(50) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `content` longtext CHARACTER SET utf8 NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `popups`
--

CREATE TABLE `popups` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `message` text NOT NULL,
  `shown` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `store_id` varchar(36) DEFAULT NULL,
  `cover` text NOT NULL,
  `images` text NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `features` text NOT NULL,
  `disclaimer` text NOT NULL,
  `orig_price` decimal(10,2) NOT NULL,
  `sell_price` decimal(10,2) NOT NULL,
  `discount_type` enum('none','percent','fixed') NOT NULL DEFAULT 'none',
  `discount` decimal(10,2) NOT NULL,
  `category_id` varchar(36) DEFAULT NULL,
  `subcategory_id` varchar(36) DEFAULT NULL,
  `have_pcs` tinyint(1) NOT NULL DEFAULT 0,
  `pcs` decimal(20,2) NOT NULL,
  `have_gram` tinyint(1) NOT NULL DEFAULT 0,
  `gram` decimal(20,2) NOT NULL,
  `have_kg` tinyint(1) NOT NULL DEFAULT 0,
  `kg` decimal(20,2) NOT NULL,
  `have_liter` tinyint(1) NOT NULL DEFAULT 0,
  `liter` decimal(20,2) NOT NULL,
  `have_ml` tinyint(1) NOT NULL DEFAULT 0,
  `ml` decimal(20,2) NOT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'in_offer',
  `in_home` tinyint(1) NOT NULL DEFAULT 0,
  `is_single` tinyint(1) NOT NULL DEFAULT 1,
  `type_of` varchar(36) NOT NULL,
  `variations` text NOT NULL,
  `pending_update` text DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` tinyint(4) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rating`
--

CREATE TABLE `rating` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(36) DEFAULT NULL,
  `pid` varchar(36) DEFAULT NULL,
  `did` varchar(36) DEFAULT NULL,
  `sid` varchar(36) DEFAULT NULL,
  `rate` enum('1','2','3','4','5') NOT NULL,
  `msg` text NOT NULL,
  `way` enum('direct','transact') NOT NULL,
  `status` tinyint(4) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `guard` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opt_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opt_val` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `guard`, `opt_key`, `opt_val`, `updated_at`) VALUES
(1, 'setup', 'secret_key', 'e8277e879e3e5dc49a60b75addac2e71', '2021-08-22 14:11:34'),
(2, 'setting', 'currencySymbol', '₱', '2021-09-04 08:29:38'),
(3, 'setting', 'currencySide', 'left', '2021-09-04 08:29:38'),
(4, 'setting', 'appDirection', 'ltr', '2021-09-04 08:29:38'),
(5, 'setting', 'logo', '512x5121.png', '2021-09-04 08:29:43'),
(6, 'setting', 'delivery', 'disable', '2021-09-04 08:29:09'),
(7, 'setting', 'reset_pwd', 'email', '2021-09-04 08:29:20'),
(8, 'setting', 'user_login', 'email', '2021-09-05 19:24:48'),
(9, 'setting', 'currency_code', 'PHP', '2021-09-13 14:46:13'),
(10, 'setting', 'timezone', 'Asia/Manila', '2021-09-13 14:46:25'),
(11, 'setting', 'web_login', 'email', '2021-09-05 19:24:55'),
(12, 'publish', 'featured_categories', '[{\"uuid\":\"58546d5c-1ac3-4f3d-a324-b5a8979745de\",\"name\":\"Households\"},{\"uuid\":\"78106d43-1cb7-4658-8d28-3af37d8e6d8f\",\"name\":\"Health Care\"},{\"uuid\":\"7092e7e2-fd19-41ac-9f89-93f38e20a99d\",\"name\":\"Fruits\"}]', '2021-09-05 06:46:00'),
(13, 'general', 'phone', '+639294294225', '2021-09-04 07:44:46'),
(14, 'general', 'email', 'support@bytescrafter.net', '2021-09-04 07:44:46'),
(15, 'general', 'address', 'B1O L18 Narra St., Silcas Village, San Francisco', '2021-09-04 07:44:46'),
(16, 'general', 'city', 'Binan City', '2021-09-04 07:44:46'),
(17, 'general', 'province', 'Laguna', '2021-09-04 07:44:46'),
(18, 'general', 'zipcode', '4024', '2021-09-04 07:44:46'),
(19, 'general', 'country', 'Philippines', '2021-09-04 07:44:46'),
(20, 'general', 'minimum_order', '500', '2021-09-04 07:44:25'),
(21, 'general', 'free_delivery', '2500', '2021-09-04 07:44:25'),
(22, 'general', 'tax', '5', '2021-09-04 07:44:25'),
(23, 'general', 'shipping', 'km', '2021-09-04 07:44:25'),
(24, 'general', 'shippingPrice', '5', '2021-09-04 08:20:00'),
(25, 'app', 'app_close', '1', '2021-09-05 19:31:45'),
(26, 'app', 'app_close_message', 'The is currently on Maintainance.', '2021-09-03 21:22:45'),
(28, 'payment', 'cod_enable', '1', '2021-09-04 08:50:22'),
(29, 'payment', 'cod_data', '{\"env\":\"production\",\"test\":\"test\",\"live\":\"test\",\"code\":\"PHP\"}', '2021-09-04 10:39:51'),
(30, 'payment', 'paypal_enable', '0', '2021-09-10 18:34:08'),
(31, 'payment', 'paypal_data', '{\"env\":\"sandbox\",\"test\":\"test\",\"live\":\"test\",\"code\":\"USD\"}', '2021-09-04 10:22:24'),
(32, 'payment', 'gcash_enable', '0', '2021-09-10 18:31:48'),
(33, 'payment', 'gcash_data', '{\"env\":\"sandbox\",\"test\":\"test\",\"live\":\"test\",\"code\":\"USD\"}', '2021-09-04 10:39:40'),
(34, 'payment', 'paymongo_enable', '0', '2021-09-10 18:31:46'),
(35, 'payment', 'paymongo_data', '{\"env\":\"sandbox\",\"test\":\"test\",\"live\":\"test\",\"code\":\"USD\"}', '2021-09-04 10:22:29'),
(36, 'payment', 'stripe_enable', '0', '2021-09-10 18:31:49'),
(37, 'payment', 'stripe_data', '{\"env\":\"sandbox\",\"test\":\"test\",\"live\":\"test\",\"code\":\"USD\"}', '2021-09-04 10:22:31');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) NOT NULL,
  `owner` varchar(36) DEFAULT NULL,
  `city_id` varchar(36) NOT NULL,
  `name` varchar(200) NOT NULL,
  `descriptions` text NOT NULL,
  `phone` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `cover` text NOT NULL,
  `images` text NOT NULL,
  `certificates` text NOT NULL COMMENT 'cert obj arrays',
  `commission` decimal(20,0) NOT NULL DEFAULT 0,
  `open_time` time NOT NULL,
  `close_time` time NOT NULL,
  `isClosed` enum('0','1') NOT NULL DEFAULT '1',
  `is_featured` enum('0','1') NOT NULL DEFAULT '0',
  `verified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(200) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` text NOT NULL,
  `cover` text NOT NULL,
  `first_name` varchar(200) NOT NULL,
  `last_name` varchar(200) NOT NULL,
  `gender` enum('male','female','other') NOT NULL COMMENT '1-male/0-female/2-others',
  `type` enum('admin','user','store','driver','operator') NOT NULL DEFAULT 'user',
  `lat` varchar(20) NOT NULL,
  `lng` varchar(20) NOT NULL,
  `others` text NOT NULL,
  `subscriber` enum('1','0') NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `verified_at` timestamp NULL DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `uid` varchar(36) NOT NULL,
  `make` varchar(50) NOT NULL,
  `model` varchar(25) NOT NULL,
  `year` varchar(5) NOT NULL,
  `plate` varchar(10) NOT NULL,
  `status` enum('1','0') NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL,
  `delete_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `address_uuid_index` (`uuid`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `banners_uuid_index` (`uuid`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_uuid_index` (`uuid`);

--
-- Indexes for table `chat_message`
--
ALTER TABLE `chat_message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_message_uuid_index` (`uuid`);

--
-- Indexes for table `chat_room`
--
ALTER TABLE `chat_room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_room_uuid_index` (`uuid`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cities_uuid_index` (`uuid`) USING BTREE;

--
-- Indexes for table `ci_sessions`
--
ALTER TABLE `ci_sessions`
  ADD KEY `ci_sessions_timestamp` (`timestamp`);

--
-- Indexes for table `favourite`
--
ALTER TABLE `favourite`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feeds`
--
ALTER TABLE `feeds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feeds_comments`
--
ALTER TABLE `feeds_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feeds_reacts`
--
ALTER TABLE `feeds_reacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_uuid_index` (`uuid`);

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pages_uuid_index` (`ukey`);

--
-- Indexes for table `popups`
--
ALTER TABLE `popups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `popup_uuid_index` (`uuid`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_uuid_index` (`uuid`),
  ADD KEY `products_store_uuid_index` (`store_id`);

--
-- Indexes for table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stores_uuid_index` (`uuid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_uuid_index` (`uuid`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicles_uuid_index` (`uuid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_message`
--
ALTER TABLE `chat_message`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_room`
--
ALTER TABLE `chat_room`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favourite`
--
ALTER TABLE `favourite`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feeds`
--
ALTER TABLE `feeds`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feeds_comments`
--
ALTER TABLE `feeds_comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feeds_reacts`
--
ALTER TABLE `feeds_reacts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `popups`
--
ALTER TABLE `popups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rating`
--
ALTER TABLE `rating`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
