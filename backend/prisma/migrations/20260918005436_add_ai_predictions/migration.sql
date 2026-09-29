-- CreateTable
CREATE TABLE `ai_predictions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NULL,
    `symbol` VARCHAR(20) NOT NULL,
    `prediction_period` VARCHAR(30) NOT NULL,
    `up_probability` DECIMAL(5, 4) NOT NULL,
    `down_probability` DECIMAL(5, 4) NOT NULL,
    `expected_min_price` DECIMAL(15, 2) NOT NULL,
    `expected_max_price` DECIMAL(15, 2) NOT NULL,
    `confidence` DECIMAL(5, 4) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ai_predictions` ADD CONSTRAINT `ai_predictions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
