-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `shopee_clone` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `shopee_clone`;

-- Drop tables in reverse order to avoid foreign key constraints issues
DROP TABLE IF EXISTS `order_details`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `shops`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `ranks`;

-- Create ranks table
CREATE TABLE `ranks` (
  `rank_id` INT PRIMARY KEY AUTO_INCREMENT,
  `rank_name` VARCHAR(50) NOT NULL,
  `min_total_value` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  `min_order_count` INT NOT NULL DEFAULT 0,
  `benefits` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create users table
CREATE TABLE `users` (
  `user_id` INT PRIMARY KEY AUTO_INCREMENT,
  `full_name` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `role` VARCHAR(50) NOT NULL DEFAULT 'customer',
  `rank_id` INT,
  `status` VARCHAR(50),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`rank_id`) REFERENCES `ranks`(`rank_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create shops table
CREATE TABLE `shops` (
  `shop_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `shop_name` VARCHAR(100) NOT NULL,
  `rating` DECIMAL(3, 2) DEFAULT 0.0,
  `description` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create orders table
CREATE TABLE `orders` (
  `order_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `shipping_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `shipping_address` TEXT NOT NULL,
  `shipping_method` VARCHAR(50) NOT NULL DEFAULT 'standard',
  `note` TEXT,
  `coupon_code` VARCHAR(50),
  `payment_method` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order details table
CREATE TABLE `order_details` (
  `order_detail_id` INT PRIMARY KEY AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL COMMENT 'Reference to product in MongoDB',
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `variant` TEXT COMMENT 'JSON string of product variant (size, color, etc.)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default ranks
INSERT INTO `ranks` (`rank_name`, `min_total_value`, `min_order_count`, `benefits`) VALUES
('Bronze', 0.00, 0, 'Basic member benefits'),
('Silver', 1000000.00, 5, 'Free shipping on orders over 200,000 VND'),
('Gold', 3000000.00, 15, 'Free shipping on all orders, 5% discount on selected items'),
('Platinum', 10000000.00, 30, 'Free shipping on all orders, 10% discount on all items, priority customer support');

-- Insert sample users (passwords are all "password123")
INSERT INTO `users` (`full_name`, `password`, `email`, `phone`, `role`, `rank_id`, `status`) VALUES
('john_doe', '$2a$10$z0akYmhQieiwBioXcx3j5OJaaqOAEoIKyKevqtiJdauOejK/IBu6q', 'john.doe@example.com', '0901234567', 'customer', 1, 'active'),
('jane_smith', '$2a$10$2XYfIMpUQg4WT0YypSlKOut8701MiCRiIHS.DGsP2hgu4ZuSGopLK', 'jane.smith@example.com', '0912345678', 'customer', 2,'active'),
('admin_user', '$2a$10$3fPuovAQshsYRVEiDAKFIurq74HkJGCwCn6VJnqTht9nxFUQ3N4YC', 'admin@shopee-clone.com', '0998765432', 'admin', 4,'active'),
('seller1', '$2a$10$zqBxkw7GnVPqY2ZN2ZYNTuMJfG6xR6TAe3w.o5pP9UG1xJRJzjgo6', 'seller1@example.com', '0923456789', 'seller', 3,'active'),
('seller2', '$2a$10$KnBhirdeHSI3SL5nlJGAOOSTJEH/Y5GDISsKgQs4cdLtTTx2gI22u', 'seller2@example.com', '0934567890', 'seller', 3,'active'),
('vip_user', '$2a$10$be4tHrJEftQn3fak9eazh.WoaM1Or6byYUTeHFhENiTx4HnpMOQG2', 'vip@example.com', '0945678901', 'customer', 4,'active'),
('new_user', '$2a$10$mmDJj0EoCh3LgbYiMZ/S/OJ1vO8FfiliggPcNWLuPj6GKKi7vBq9m', 'new.user@example.com', '0956789012', 'customer', 1,'active');

-- Insert sample shops
INSERT INTO `shops` (`user_id`, `shop_name`, `rating`, `description`) VALUES
(4, 'Tech Gadgets', 4.8, 'We sell the latest technology gadgets and accessories'),
(5, 'Fashion Store', 4.5, 'Trendy fashion items for all ages and styles');

-- Insert sample orders
INSERT INTO `orders` (`user_id`, `status`, `total_amount`, `shipping_fee`, `shipping_address`, `shipping_method`, `payment_method`, `note`) VALUES
(1, 'delivered', 520000.00, 20000.00, '123 Example St, District 1, HCMC', 'express', 'cash_on_delivery', 'Please call before delivery'),
(1, 'processing', 780000.00, 30000.00, '123 Example St, District 1, HCMC', 'standard', 'credit_card', NULL),
(2, 'delivered', 1250000.00, 0.00, '456 Sample Rd, District 2, HCMC', 'express', 'shopee_pay', 'Leave at the door'),
(2, 'shipped', 350000.00, 25000.00, '456 Sample Rd, District 2, HCMC', 'standard', 'bank_transfer', NULL),
(6, 'confirmed', 2500000.00, 0.00, '789 VIP Blvd, District 3, HCMC', 'express', 'credit_card', 'Call on arrival'),
(7, 'pending', 125000.00, 15000.00, '101 New St, District 4, HCMC', 'standard', 'cash_on_delivery', NULL);

-- Insert sample order details (product_id will reference MongoDB products)
INSERT INTO `order_details` (`order_id`, `product_id`, `quantity`, `unit_price`, `variant`) VALUES
(1, 1001, 1, 500000.00, '{"color": "black", "memory": "128GB"}'),
(2, 1002, 2, 250000.00, '{"color": "blue", "size": "M"}'),
(2, 1003, 1, 280000.00, '{"color": "white", "size": "L"}'),
(3, 1004, 1, 1250000.00, '{"color": "silver", "memory": "512GB"}'),
(4, 1005, 2, 175000.00, '{"color": "red", "size": "S"}'),
(5, 1006, 1, 2500000.00, '{"color": "gold", "memory": "1TB"}'),
(6, 1007, 1, 125000.00, '{"color": "green", "size": "XL"}');

-- Add indexes for performance
ALTER TABLE `users` ADD INDEX `idx_users_email` (`email`);
ALTER TABLE `users` ADD INDEX `idx_users_role` (`role`);
ALTER TABLE `orders` ADD INDEX `idx_orders_user_id` (`user_id`);
ALTER TABLE `orders` ADD INDEX `idx_orders_status` (`status`);
ALTER TABLE `order_details` ADD INDEX `idx_order_details_order_id` (`order_id`);
ALTER TABLE `order_details` ADD INDEX `idx_order_details_product_id` (`product_id`);
