-- CreateTable
CREATE TABLE `holdings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `symbol` VARCHAR(20) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `average_price` DECIMAL(15, 2) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `holdings_user_id_symbol_key`(`user_id`, `symbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `holdings` ADD CONSTRAINT `holdings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
