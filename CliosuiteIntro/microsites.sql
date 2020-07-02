
CREATE TABLE `cliosuite_registration` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `mobile_std_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
 `mobile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `legal_business_name` varchar(255) COLLATE utf8mb4_unicode_ci,
 `business_identifier` varchar(255) COLLATE utf8mb4_unicode_ci,
 `legal_business_address` varchar(500) COLLATE utf8mb4_unicode_ci,
 `zip_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `country_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `user_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `average_item_price` varchar(255) COLLATE utf8mb4_unicode_ci,
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`),
 UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `survey_response` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `user_id` varchar(255) COLLATE utf8mb4_unicode_ci,
 `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `profession` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `gender` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
 `module` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `other_module` varchar(200) COLLATE utf8mb4_unicode_ci,
 `technologies` varchar(200) COLLATE utf8mb4_unicode_ci,
 `js` varchar(10) COLLATE utf8mb4_unicode_ci,
 `other_tech` varchar(500) COLLATE utf8mb4_unicode_ci,
 `contribute` varchar(10) COLLATE utf8mb4_unicode_ci,
 `devreq` varchar(10) COLLATE utf8mb4_unicode_ci,
 `comm` varchar(10) COLLATE utf8mb4_unicode_ci,
 `pricing` varchar(10) COLLATE utf8mb4_unicode_ci,
 `other_pricing` varchar(50) COLLATE utf8mb4_unicode_ci,
 `additional_feedback` varchar(500) COLLATE utf8mb4_unicode_ci,
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`),
 UNIQUE KEY  `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `fraud_attempt` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
`real_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`fake_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
UNIQUE KEY  `real_fake_email` (`real_email`,`fake_email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
