-- CreateTable
CREATE TABLE `auto_trades` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `symbol` VARCHAR(20) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `target_price` DECIMAL(15, 2) NOT NULL,
    `stop_loss_price` DECIMAL(15, 2) NOT NULL,
    `status` ENUM('ACTIVE', 'STOPPED', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auto_trades` ADD CONSTRAINT `auto_trades_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
