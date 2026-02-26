-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Feb 26, 2026 at 04:28 PM
-- Server version: 8.0.41
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auth_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `aiaas_services`
--

CREATE TABLE `aiaas_services` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_credentials`
--

CREATE TABLE `auth_credentials` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `type` enum('password','google','github') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'password',
  `secret_hash` varchar(255) DEFAULT NULL,
  `version` int DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_orgs`
--

CREATE TABLE `auth_orgs` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(50) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `website` varchar(255) DEFAULT NULL,
  `logo_url` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` enum('active','suspended','deleted') NOT NULL DEFAULT 'active',
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_orgs_aiaas_services`
--

CREATE TABLE `auth_orgs_aiaas_services` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `org_id` char(36) NOT NULL,
  `aiaas_service_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_orgs_users`
--

CREATE TABLE `auth_orgs_users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `org_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` char(36) NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permissions`
--

CREATE TABLE `auth_permissions` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `aiaas_service_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `resource_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_refresh_tokens`
--

CREATE TABLE `auth_refresh_tokens` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `session_id` char(36) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `rotated_from` char(36) DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL,
  `revoked_reason` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_roles`
--

CREATE TABLE `auth_roles` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `description` text,
  `auth_orgs_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_roles_permissions`
--

CREATE TABLE `auth_roles_permissions` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `auth_roles_id` char(36) NOT NULL,
  `auth_permissions_id` char(36) NOT NULL,
  `auth_orgs_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_sessions`
--

CREATE TABLE `auth_sessions` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `auth_org_id` char(36) DEFAULT NULL,
  `refresh_token_hash` varchar(255) DEFAULT NULL,
  `is_revoked` tinyint(1) NOT NULL DEFAULT '0',
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text,
  `credential_version` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_users`
--

CREATE TABLE `auth_users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_email_verified` tinyint(1) DEFAULT '0',
  `is_phone_verified` tinyint(1) DEFAULT '0',
  `status` enum('active','suspended','deleted','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `failed_attempts` int NOT NULL DEFAULT '0',
  `lock_until` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_roles`
--

CREATE TABLE `auth_user_roles` (
  `id` char(36) NOT NULL,
  `auth_user_id` char(36) NOT NULL,
  `auth_role_id` char(36) NOT NULL,
  `auth_org_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aiaas_services`
--
ALTER TABLE `aiaas_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `auth_credentials`
--
ALTER TABLE `auth_credentials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_unique_active_type` (`user_id`,`type`,`is_active`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_last_used_at` (`last_used_at`);

--
-- Indexes for table `auth_orgs`
--
ALTER TABLE `auth_orgs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_auth_user_id` (`created_by`);

--
-- Indexes for table `auth_orgs_aiaas_services`
--
ALTER TABLE `auth_orgs_aiaas_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_org_id` (`org_id`),
  ADD KEY `idx_aiaas_service_id` (`aiaas_service_id`);

--
-- Indexes for table `auth_orgs_users`
--
ALTER TABLE `auth_orgs_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_org_user` (`org_id`,`user_id`),
  ADD KEY `idx_org_id` (`org_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_joined_at` (`joined_at`);

--
-- Indexes for table `auth_permissions`
--
ALTER TABLE `auth_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_aiaas_service_id` (`aiaas_service_id`),
  ADD KEY `idx_perm_service_name` (`aiaas_service_id`,`name`);

--
-- Indexes for table `auth_refresh_tokens`
--
ALTER TABLE `auth_refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_token_hash` (`token_hash`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `idx_revoked_at` (`revoked_at`),
  ADD KEY `idx_rotated_from` (`rotated_from`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_valid_tokens` (`token_hash`,`expires_at`,`revoked_at`);

--
-- Indexes for table `auth_roles`
--
ALTER TABLE `auth_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_org_role` (`auth_orgs_id`,`name`),
  ADD KEY `idx_auth_orgs_id` (`auth_orgs_id`);

--
-- Indexes for table `auth_roles_permissions`
--
ALTER TABLE `auth_roles_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_role_permission` (`auth_permissions_id`,`auth_roles_id`),
  ADD KEY `idx_auth_roles_id` (`auth_roles_id`),
  ADD KEY `idx_aiaas_service_permissions_id` (`auth_permissions_id`),
  ADD KEY `fk_auth_orgs_id` (`auth_orgs_id`);

--
-- Indexes for table `auth_sessions`
--
ALTER TABLE `auth_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `is_revoked` (`is_revoked`),
  ADD KEY `fk_auth_org_id` (`auth_org_id`);

--
-- Indexes for table `auth_users`
--
ALTER TABLE `auth_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_phone` (`phone`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_deleted_at` (`deleted_at`);

--
-- Indexes for table `auth_user_roles`
--
ALTER TABLE `auth_user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_role_org` (`auth_user_id`,`auth_role_id`,`auth_org_id`),
  ADD KEY `auth_role_id` (`auth_role_id`),
  ADD KEY `auth_org_id` (`auth_org_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_credentials`
--
ALTER TABLE `auth_credentials`
  ADD CONSTRAINT `fk_auth_credentials_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_orgs`
--
ALTER TABLE `auth_orgs`
  ADD CONSTRAINT `fk_auth_user_id` FOREIGN KEY (`created_by`) REFERENCES `auth_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `auth_orgs_aiaas_services`
--
ALTER TABLE `auth_orgs_aiaas_services`
  ADD CONSTRAINT `fk_orgs_aiaas_services_aiaas_service_id` FOREIGN KEY (`aiaas_service_id`) REFERENCES `aiaas_services` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_orgs_aiaas_services_org_id` FOREIGN KEY (`org_id`) REFERENCES `auth_orgs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_orgs_users`
--
ALTER TABLE `auth_orgs_users`
  ADD CONSTRAINT `fk_auth_orgs_users_org_id` FOREIGN KEY (`org_id`) REFERENCES `auth_orgs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_auth_orgs_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_permissions`
--
ALTER TABLE `auth_permissions`
  ADD CONSTRAINT `fk_aiaas_service_permissions_aiaas_service_id` FOREIGN KEY (`aiaas_service_id`) REFERENCES `aiaas_services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_refresh_tokens`
--
ALTER TABLE `auth_refresh_tokens`
  ADD CONSTRAINT `fk_auth_refresh_tokens_session_id` FOREIGN KEY (`session_id`) REFERENCES `auth_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_roles`
--
ALTER TABLE `auth_roles`
  ADD CONSTRAINT `fk_auth_roles_auth_orgs_id` FOREIGN KEY (`auth_orgs_id`) REFERENCES `auth_orgs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_roles_permissions`
--
ALTER TABLE `auth_roles_permissions`
  ADD CONSTRAINT `fk_auth_orgs_id` FOREIGN KEY (`auth_orgs_id`) REFERENCES `auth_orgs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_auth_roles_permissions_auth_permissions_id` FOREIGN KEY (`auth_permissions_id`) REFERENCES `auth_permissions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_auth_roles_permissions_auth_roles_id` FOREIGN KEY (`auth_roles_id`) REFERENCES `auth_roles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `auth_sessions`
--
ALTER TABLE `auth_sessions`
  ADD CONSTRAINT `fk_auth_org_id` FOREIGN KEY (`auth_org_id`) REFERENCES `auth_orgs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_auth_sessions_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_user_roles`
--
ALTER TABLE `auth_user_roles`
  ADD CONSTRAINT `auth_user_roles_ibfk_1` FOREIGN KEY (`auth_user_id`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `auth_user_roles_ibfk_2` FOREIGN KEY (`auth_role_id`) REFERENCES `auth_roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `auth_user_roles_ibfk_3` FOREIGN KEY (`auth_org_id`) REFERENCES `auth_orgs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
