-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 28, 2021 at 12:00 PM
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
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
  `province` varchar(200) NOT NULL,
  `country` varchar(200) NOT NULL,
  `lat` text NOT NULL,
  `lng` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
  `store_id` varchar(36) DEFAULT NULL,
  `driver_id` varchar(36) DEFAULT NULL,
  `progress` mediumtext NOT NULL COMMENT '[{status,message,timestamp}]',
  `matrix` text DEFAULT NULL COMMENT '{origin,destinations[],distances[{distance,duration}]}',
  `items` longtext NOT NULL COMMENT '[{uuid,name,price,discount_type,discount,pcs,kg,gram,liter,ml,length,width,height,category_id,subcategory_id,quantity,variantions[]}]\r\n',
  `factor` text NOT NULL COMMENT '{schedule,tax,ship_mode,ship_price}',
  `coupon` text NOT NULL COMMENT '{uuid,name,description,type,off,min,upto,expires}',
  `total` decimal(20,2) NOT NULL,
  `delivery` decimal(20,2) NOT NULL,
  `discount` decimal(20,2) NOT NULL,
  `tax` decimal(20,2) NOT NULL,
  `grand_total` decimal(20,2) NOT NULL,
  `paid_method` enum('cod','google','gcash','paypal','stripe') NOT NULL,
  `pay_key` varchar(100) DEFAULT NULL,
  `stage` enum('draft','created','rejected','ongoing','shipping','cancelled','delivered') NOT NULL DEFAULT 'created',
  `status` set('1','0') NOT NULL DEFAULT '1',
  `timestamp` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
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
  `timestamp` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `ukey`, `name`, `content`, `status`, `timestamp`, `updated_at`, `deleted_at`) VALUES
(1, 'about', 'About Us', '<h2><strong>About us</strong></h2>\n\n<p>Brilliant eShop is a store primarily engaged in retailing a general range of food products, with fresh and packaged groceries.</p>\n\n<p>Brilliant eShop&nbsp;is your low price online store where you get the latest products from Patanjali, Aashirvaad, Saffola, Fortune, Nestle, Amul, Mother Dairy, Pepsi, Colgate, Dabur, Surf Excel, Maggi, Vim, Haldiram&#39;s and Pampers amongst other leading brands.</p>\n\n<p>Hygienically Packed &amp; Safely Delivered at your doorstep by our delivery partners. Experience Lower Prices across Products with Safe Delivery at your doorstep. Shop Now! Offers on Fruit Cleaners. Up to 64% off on Atta. Up To 50% off Detergents.</p>\n\n<p>hoose from a wide range of&nbsp;<em>grocery</em>, baby care products, personal care products, fresh fruits &amp; vegetables online. Pay Online.</p>\n\n<p>Buy Galyon&nbsp; Online at Best Price. Shop from Paytm Mall Mall Online Supermarket which includes Food Range, Home care, Personal Care, Pet Supplies..</p>\n\n<p>Nature&#39;s Basket is an online supermarket &amp;&nbsp;<em>grocery</em>&nbsp;store offering the best online food &amp;&nbsp;<em>grocery</em>&nbsp;shopping experience in India at best prices. Buy daily food&nbsp;..</p>\n\n<p>Buy in bulk online with Boxed. Shop wholesale products such as&nbsp;<em>groceries</em>, household products, and health supplies. Get delivery service right to your door.</p>\n', 1, '2021-09-03 20:10:04', '2021-09-21 21:32:38', NULL),
(2, 'privacy', 'Privacy', '<h1>Privacy Policy</h1>\n\n<p>At Brilliant eShop, accessible from https://galyon.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Galyon&nbsp;and how we use it.</p>\n\n<p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>\n\n<p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Galyon&nbsp;. This policy is not applicable to any information collected offline or via channels other than this website.</p>\n\n<h2>Consent</h2>\n\n<p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>\n\n<h2>Information we collect</h2>\n\n<p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>\n\n<p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>\n\n<p>When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>\n\n<h2>How we use your information</h2>\n\n<p>We use the information we collect in various ways, including to:</p>\n\n<ul>\n	<li>Provide, operate, and maintain our webste</li>\n	<li>Improve, personalize, and expand our webste</li>\n	<li>Understand and analyze how you use our webste</li>\n	<li>Develop new products, services, features, and functionality</li>\n	<li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the webste, and for marketing and promotional purposes</li>\n	<li>Send you emails</li>\n	<li>Find and prevent fraud</li>\n</ul>\n\n<h2>Log Files</h2>\n\n<p>Galyon&nbsp;follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services&#39; analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&#39; movement on the website, and gathering demographic information. Our Privacy Policy was created with the help of the&nbsp;<a href=\"https://www.privacypolicygenerator.info/\">Privacy Policy Generator</a>&nbsp;and the&nbsp;<a href=\"https://www.privacypolicyonline.com/privacy-policy-generator/\">Online Privacy Policy Generator</a>.</p>\n\n<h2>Cookies and Web Beacons</h2>\n\n<p>Like any other website, Galyon&nbsp;uses &#39;cookies&#39;. These cookies are used to store information including visitors&#39; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&#39; experience by customizing our web page content based on visitors&#39; browser type and/or other information.</p>\n\n<p>For more general information on cookies, please read&nbsp;<a href=\"https://www.cookieconsent.com/what-are-cookies/\">&quot;What Are Cookies&quot;</a>.</p>\n\n<h2>Advertising Partners Privacy Policies</h2>\n\n<p>You may consult this list to find the Privacy Policy for each of the advertising partners of Galyon.</p>\n\n<p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Galyon, which are sent directly to users&#39; browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>\n\n<p>Note that Galyon&nbsp;has no access to or control over these cookies that are used by third-party advertisers.</p>\n\n<h2>Third Party Privacy Policies</h2>\n\n<p>Galyon&#39;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>\n\n<p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers&#39; respective websites.</p>\n\n<h2>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>\n\n<p>Under the CCPA, among other rights, California consumers have the right to:</p>\n\n<p>Request that a business that collects a consumer&#39;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</p>\n\n<p>Request that a business delete any personal data about the consumer that a business has collected.</p>\n\n<p>Request that a business that sells a consumer&#39;s personal data, not sell the consumer&#39;s personal data.</p>\n\n<p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>\n\n<h2>GDPR Data Protection Rights</h2>\n\n<p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>\n\n<p>The right to access &acirc;&euro;&ldquo; You have the right to request copies of your personal data. We may charge you a small fee for this service.</p>\n\n<p>The right to rectification &acirc;&euro;&ldquo; You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</p>\n\n<p>The right to erasure &acirc;&euro;&ldquo; You have the right to request that we erase your personal data, under certain conditions.</p>\n\n<p>The right to restrict processing &acirc;&euro;&ldquo; You have the right to request that we restrict the processing of your personal data, under certain conditions.</p>\n\n<p>The right to object to processing &acirc;&euro;&ldquo; You have the right to object to our processing of your personal data, under certain conditions.</p>\n\n<p>The right to data portability &acirc;&euro;&ldquo; You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p>\n\n<p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>\n\n<h2>Children&#39;s Information</h2>\n\n<p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>\n\n<p>Galyon&nbsp;does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>\n', 1, '2021-09-03 20:10:04', '2021-09-21 21:32:50', NULL),
(3, 'terms', 'Terms & Conditions', '<p>&lt;h2&gt;&lt;strong&gt;Terms and Conditions&lt;/strong&gt;&lt;/h2&gt;</p>\n\n<p>&lt;p&gt;Welcome to Brilliant eShop!&lt;/p&gt;</p>\n\n<p>&lt;p&gt;These terms and conditions outline the rules and regulations for the use of Groceryee&#39;s Website, located at https//galyon.com.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;By accessing this website we assume you accept these terms and conditions. Do not continue to use Galyon if you do not agree to take all of the terms and conditions stated on this page.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: &quot;Client&quot;, &quot;You&quot; and &quot;Your&quot; refers to you, the person log on this website and compliant to the Company&rsquo;s terms and conditions. &quot;The Company&quot;, &quot;Ourselves&quot;, &quot;We&quot;, &quot;Our&quot; and &quot;Us&quot;, refers to our Company. &quot;Party&quot;, &quot;Parties&quot;, or &quot;Us&quot;, refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client&rsquo;s needs in respect of provision of the Company&rsquo;s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.&lt;/p&gt;</p>\n\n<p>&lt;h3&gt;&lt;strong&gt;Cookies&lt;/strong&gt;&lt;/h3&gt;</p>\n\n<p>&lt;p&gt;We employ the use of cookies. By accessing Galyon, you agreed to use cookies in agreement with the Groceryee&#39;s Privacy Policy. &lt;/p&gt;</p>\n\n<p>&lt;p&gt;Most interactive websites use cookies to let us retrieve the user&rsquo;s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.&lt;/p&gt;</p>\n\n<p>&lt;h3&gt;&lt;strong&gt;License&lt;/strong&gt;&lt;/h3&gt;</p>\n\n<p>&lt;p&gt;Unless otherwise stated, Groceryee and/or its licensors own the intellectual property rights for all material on Galyon. All intellectual property rights are reserved. You may access this from Galyon for your own personal use subjected to restrictions set in these terms and conditions.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;You must not:&lt;/p&gt;<br />\n&lt;ul&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;Republish material from Galyon&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;Sell, rent or sub-license material from Galyon&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;Reproduce, duplicate or copy material from Galyon&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;Redistribute content from Galyon&lt;/li&gt;<br />\n&lt;/ul&gt;</p>\n\n<p>&lt;p&gt;This Agreement shall begin on the date hereof. Our Terms and Conditions were created with the help of the &lt;a href=&quot;https://www.termsandconditionsgenerator.com&quot;&gt;Terms And Conditions Generator&lt;/a&gt; and the &lt;a href=&quot;https://www.generateprivacypolicy.com&quot;&gt;Privacy Policy Generator&lt;/a&gt;.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Groceryee does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Groceryee,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, Groceryee shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;Groceryee reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;You warrant and represent that:&lt;/p&gt;</p>\n\n<p>&lt;ul&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.&lt;/li&gt;<br />\n&lt;/ul&gt;</p>\n\n<p>&lt;p&gt;You hereby grant Groceryee a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.&lt;/p&gt;</p>\n\n<p>&lt;h3&gt;&lt;strong&gt;Hyperlinking to our Content&lt;/strong&gt;&lt;/h3&gt;</p>\n\n<p>&lt;p&gt;The following organizations may link to our Website without prior written approval:&lt;/p&gt;</p>\n\n<p>&lt;ul&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;Government agencies;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;Search engines;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;News organizations;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.&lt;/li&gt;<br />\n&lt;/ul&gt;</p>\n\n<p>&lt;p&gt;These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party&rsquo;s site.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;We may consider and approve other link requests from the following types of organizations:&lt;/p&gt;</p>\n\n<p>&lt;ul&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;commonly-known consumer and/or business information sources;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;dot.com community sites;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;associations or other groups representing charities;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;online directory distributors;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;internet portals;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;accounting, law and consulting firms; and&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;educational institutions and trade associations.&lt;/li&gt;<br />\n&lt;/ul&gt;</p>\n\n<p>&lt;p&gt;We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Groceryee; and (d) the link is in the context of general resource information.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party&rsquo;s site.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Groceryee. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;Approved organizations may hyperlink to our Website as follows:&lt;/p&gt;</p>\n\n<p>&lt;ul&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;By use of our corporate name; or&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;By use of the uniform resource locator being linked to; or&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party&rsquo;s site.&lt;/li&gt;<br />\n&lt;/ul&gt;</p>\n\n<p>&lt;p&gt;No use of Groceryee&#39;s logo or other artwork will be allowed for linking absent a trademark license agreement.&lt;/p&gt;</p>\n\n<p>&lt;h3&gt;&lt;strong&gt;iFrames&lt;/strong&gt;&lt;/h3&gt;</p>\n\n<p>&lt;p&gt;Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.&lt;/p&gt;</p>\n\n<p>&lt;h3&gt;&lt;strong&gt;Content Liability&lt;/strong&gt;&lt;/h3&gt;</p>\n\n<p>&lt;p&gt;We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.&lt;/p&gt;</p>\n\n<p>&lt;h3&gt;&lt;strong&gt;Your Privacy&lt;/strong&gt;&lt;/h3&gt;</p>\n\n<p>&lt;p&gt;Please read Privacy Policy&lt;/p&gt;</p>\n\n<p>&lt;h3&gt;&lt;strong&gt;Reservation of Rights&lt;/strong&gt;&lt;/h3&gt;</p>\n\n<p>&lt;p&gt;We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it&rsquo;s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.&lt;/p&gt;</p>\n\n<p>&lt;h3&gt;&lt;strong&gt;Removal of links from our website&lt;/strong&gt;&lt;/h3&gt;</p>\n\n<p>&lt;p&gt;If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.&lt;/p&gt;</p>\n\n<p>&lt;h3&gt;&lt;strong&gt;Disclaimer&lt;/strong&gt;&lt;/h3&gt;</p>\n\n<p>&lt;p&gt;To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:&lt;/p&gt;</p>\n\n<p>&lt;ul&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;limit or exclude our or your liability for death or personal injury;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;limit or exclude our or your liability for fraud or fraudulent misrepresentation;&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;limit any of our or your liabilities in any way that is not permitted under applicable law; or&lt;/li&gt;<br />\n&nbsp; &nbsp; &lt;li&gt;exclude any of our or your liabilities that may not be excluded under applicable law.&lt;/li&gt;<br />\n&lt;/ul&gt;</p>\n\n<p>&lt;p&gt;The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.&lt;/p&gt;</p>\n\n<p>&lt;p&gt;As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.&lt;/p&gt;</p>\n', 1, '2021-09-03 20:10:04', '2021-09-21 21:32:56', NULL),
(4, 'refund', 'Refund Policy', '<pre>\nRefund policy We&#39;re so convinced you&#39;ll absolutely love our products,\nthat we&#39;re willing to offer a 60 day risk-free money back guarantee.\nIf you are not satisfied with the product for any reason you can get a refund within 60 days of making a purchase.\nContacting us If you have any questions about our refund policy, please contact us. \nThis document was last updated on September 11, 2020\n</pre>\n', 1, '2021-09-03 20:10:04', '2021-09-03 12:05:53', NULL),
(5, 'faqs', 'Frequently Asked Questions', '<p><strong>Q: How should I format my tutorial proposal submission?</strong></p>\n\n<p>A: Each tutorial submission must present its course information through the SC submissions website, where a form will collect basic information (the tutorial&rsquo;s title, length, presenter information, and keywords). A sample form is available at the submissions website. Further details about the proposal, such as goals, targeted audience, and outline, should be written in a PDF and uploaded as an attachment to the submission form. The format for the PDF is documented in the How to Submit section of the submissions website. Submitters are particularly encouraged to include a draft of their full tutorial presentation in the Sample of Visual Material section of the submission form.</p>\n\n<p><strong>Q: Can I make changes to my tutorial materials after I have submitted them?</strong></p>\n\n<p>A: Tutorial presenters are generally expected to use the material submitted, with no changes. Minor extensions may be granted to enable a presenter to include more timely material, or to comply with conditions beyond the presenter&rsquo;s control (e.g., new decisions adopted by standards bodies). In such cases, the submitted material should be as close to a final version as possible, and clearly indicate where changes are anticipated. Also, the deadline for the submission of the material is only one week before the tutorial, so no major updates are expected.<br />\nChanges requested because a presenter had insufficient time to prepare and submit their materials cannot be accommodated.</p>\n\n<p><strong>Q: What are the expectations of tutorial presentations at the conference?</strong></p>\n\n<p>A: SC Tutorials are some of the most popular sessions at the conference, attracting several thousand participants. Tutorial abstracts must clearly present what lessons can be learned, and tutorial presenters are expected to deliver professional presentations and to treat tutorial attendees with respect. Each tutorial will be evaluated in detail by attendees after the session, and these evaluations will play a crucial role in the evaluation of future-year tutorial submissions.</p>\n\n<p><strong>Q: Q: Is the peer-review process double-blind?</strong></p>\n\n<p>A: No. Reviewers have access to the names of tutorial submitters. While Tutorials Committee members are named on the SC19 Planning Committee page, the names of the individuals reviewing each proposal are not made available to the authors.</p>\n\n<p><strong>Q: What are the guidelines for conflicts of interest (COI)?</strong></p>\n\n<p>A: A potential conflict of interest occurs when a person is involved in making a decision that:</p>\n\n<ol>\n	<li>\n	<p>Could result in that person, a close associate of that person, or that person&rsquo;s company or institution receiving significant financial gain, such as a contract or grant.</p>\n	</li>\n	<li>\n	<p>Could result in that person, or a close associate of that person, receiving significant professional recognition, such as an award or the selection of a paper, work, exhibit, or other type of submitted presentation.</p>\n	</li>\n</ol>\n\n<p>Authors and Tutorials Committee members will be given the opportunity to list any potential COIs during the submissions and review processes, respectively. The Tutorials Committee Chair will make every effort to avoid assignments that have a potential COI.</p>\n\n<p>According to the SC Conference you have a conflict of interest with:</p>\n\n<ul>\n	<li>Your PhD advisors, post-doctoral advisors, PhD students, and post-doctoral advisees forever;</li>\n	<li>Family relations by blood or marriage, or equivalent (e.g., a partner);</li>\n	<li>People with whom you collaborated in the past five years. Collaborators include: co-authors on an accepted/rejected/pending research paper; co-PIs on an accepted/pending grant; those who fund your research; researchers whom you fund; or researchers with whom you are actively collaborating;</li>\n	<li>Close personal friends or others with whom you believe a conflict of interest exists;</li>\n	<li>People who were employed by, or a student at, your primary institution(s) in the past five years, or people who are active candidates for employment at your primary institution(s).</li>\n</ul>\n\n<p>Note that &ldquo;service&rdquo; collaborations, such as writing a DOE, NSF, or DARPA report, or serving on a program committee, or serving on the editorial board of a journal do not inherently create a COI.</p>\n\n<p><strong>Q: What rooms and audio/video infrastructure are provided to each tutorial?</strong></p>\n\n<p>A: Tutorials are assigned either a classroom or theater room equipped with standard AV facilities (projector, microphone and podium, wireless lapel microphone or wireless handheld microphone, and projection screen).</p>\n\n<p><strong>Q: Will tutorials&rsquo; material be provided in a USB?</strong></p>\n\n<p>A: No. Tutorials&rsquo; materials will be available for download in a password protected repository.</p>\n', 1, '2021-09-03 20:10:04', '2021-09-03 12:05:58', NULL),
(6, 'help', 'Help', '<p><strong>Q: How should I format my tutorial proposal submission?</strong></p>\n\n<p>A: Each tutorial submission must present its course information through the SC submissions website, where a form will collect basic information (the tutorial&rsquo;s title, length, presenter information, and keywords). A sample form is available at the submissions website. Further details about the proposal, such as goals, targeted audience, and outline, should be written in a PDF and uploaded as an attachment to the submission form. The format for the PDF is documented in the How to Submit section of the submissions website. Submitters are particularly encouraged to include a draft of their full tutorial presentation in the Sample of Visual Material section of the submission form.</p>\n\n<p><strong>Q: Can I make changes to my tutorial materials after I have submitted them?</strong></p>\n\n<p>A: Tutorial presenters are generally expected to use the material submitted, with no changes. Minor extensions may be granted to enable a presenter to include more timely material, or to comply with conditions beyond the presenter&rsquo;s control (e.g., new decisions adopted by standards bodies). In such cases, the submitted material should be as close to a final version as possible, and clearly indicate where changes are anticipated. Also, the deadline for the submission of the material is only one week before the tutorial, so no major updates are expected.<br />\nChanges requested because a presenter had insufficient time to prepare and submit their materials cannot be accommodated.</p>\n\n<p><strong>Q: What are the expectations of tutorial presentations at the conference?</strong></p>\n\n<p>A: SC Tutorials are some of the most popular sessions at the conference, attracting several thousand participants. Tutorial abstracts must clearly present what lessons can be learned, and tutorial presenters are expected to deliver professional presentations and to treat tutorial attendees with respect. Each tutorial will be evaluated in detail by attendees after the session, and these evaluations will play a crucial role in the evaluation of future-year tutorial submissions.</p>\n\n<p><strong>Q: Q: Is the peer-review process double-blind?</strong></p>\n\n<p>A: No. Reviewers have access to the names of tutorial submitters. While Tutorials Committee members are named on the SC19 Planning Committee page, the names of the individuals reviewing each proposal are not made available to the authors.</p>\n\n<p><strong>Q: What are the guidelines for conflicts of interest (COI)?</strong></p>\n\n<p>A: A potential conflict of interest occurs when a person is involved in making a decision that:</p>\n\n<ol>\n	<li>\n	<p>Could result in that person, a close associate of that person, or that person&rsquo;s company or institution receiving significant financial gain, such as a contract or grant.</p>\n	</li>\n	<li>\n	<p>Could result in that person, or a close associate of that person, receiving significant professional recognition, such as an award or the selection of a paper, work, exhibit, or other type of submitted presentation.</p>\n	</li>\n</ol>\n\n<p>Authors and Tutorials Committee members will be given the opportunity to list any potential COIs during the submissions and review processes, respectively. The Tutorials Committee Chair will make every effort to avoid assignments that have a potential COI.</p>\n\n<p>According to the SC Conference you have a conflict of interest with:</p>\n\n<ul>\n	<li>Your PhD advisors, post-doctoral advisors, PhD students, and post-doctoral advisees forever;</li>\n	<li>Family relations by blood or marriage, or equivalent (e.g., a partner);</li>\n	<li>People with whom you collaborated in the past five years. Collaborators include: co-authors on an accepted/rejected/pending research paper; co-PIs on an accepted/pending grant; those who fund your research; researchers whom you fund; or researchers with whom you are actively collaborating;</li>\n	<li>Close personal friends or others with whom you believe a conflict of interest exists;</li>\n	<li>People who were employed by, or a student at, your primary institution(s) in the past five years, or people who are active candidates for employment at your primary institution(s).</li>\n</ul>\n\n<p>Note that &ldquo;service&rdquo; collaborations, such as writing a DOE, NSF, or DARPA report, or serving on a program committee, or serving on the editorial board of a journal do not inherently create a COI.</p>\n\n<p><strong>Q: What rooms and audio/video infrastructure are provided to each tutorial?</strong></p>\n\n<p>A: Tutorials are assigned either a classroom or theater room equipped with standard AV facilities (projector, microphone and podium, wireless lapel microphone or wireless handheld microphone, and projection screen).</p>\n\n<p><strong>Q: Will tutorials&rsquo; material be provided in a USB?</strong></p>\n\n<p>A: No. Tutorials&rsquo; materials will be available for download in a password protected repository.</p>\n', 1, '2021-09-03 20:10:04', '2021-09-03 12:21:00', NULL);

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
  `timestamp` datetime DEFAULT NULL,
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
  `template` varchar(36) DEFAULT NULL,
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
  `have_pcs` enum('0','1') NOT NULL DEFAULT '0',
  `pcs` decimal(20,2) DEFAULT NULL,
  `have_gram` enum('0','1') NOT NULL DEFAULT '0',
  `gram` decimal(20,2) DEFAULT NULL,
  `have_kg` enum('0','1') NOT NULL DEFAULT '0',
  `kg` decimal(20,2) DEFAULT NULL,
  `have_liter` enum('0','1') NOT NULL DEFAULT '0',
  `liter` decimal(20,2) DEFAULT NULL,
  `have_ml` enum('0','1') NOT NULL DEFAULT '0',
  `ml` decimal(20,2) DEFAULT NULL,
  `in_stock` enum('0','1') NOT NULL DEFAULT '0',
  `is_featured` enum('0','1') NOT NULL DEFAULT '0' COMMENT 'in_offer',
  `in_home` enum('0','1') NOT NULL DEFAULT '0',
  `is_single` enum('0','1') NOT NULL DEFAULT '1',
  `type_of` varchar(36) DEFAULT NULL,
  `variations` text NOT NULL,
  `pending_update` text DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
(14, 'general', 'email', 'contact@brilliantskinessentials.ph', '2021-09-21 21:36:06'),
(15, 'general', 'address', '35 J. Sta. Catalina St., Sitio Caingin ', '2021-09-21 21:36:06'),
(16, 'general', 'city', 'Morong', '2021-09-21 21:36:06'),
(17, 'general', 'province', 'Rizal', '2021-09-21 21:36:06'),
(18, 'general', 'zipcode', '19600', '2021-09-26 10:38:04'),
(19, 'general', 'country', 'Philippines', '2021-09-04 07:44:46'),
(20, 'general', 'minimum_order', '500', '2021-09-04 07:44:25'),
(21, 'general', 'free_delivery', '2500', '2021-09-04 07:44:25'),
(22, 'general', 'tax', '12', '2021-09-15 19:25:29'),
(23, 'general', 'shipping', 'km', '2021-09-26 10:46:00'),
(24, 'general', 'shippingPrice', '5', '2021-09-26 10:10:24'),
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
(37, 'payment', 'stripe_data', '{\"env\":\"sandbox\",\"test\":\"test\",\"live\":\"test\",\"code\":\"USD\"}', '2021-09-04 10:22:31'),
(38, 'general', 'shippingBase', '29', '2021-09-26 10:46:00');

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
  `pending_update` text DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` datetime DEFAULT NULL,
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
  `activation_key` text DEFAULT NULL,
  `reset_key` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `verified_at` timestamp NULL DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
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
  `timestamp` datetime DEFAULT NULL,
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

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
