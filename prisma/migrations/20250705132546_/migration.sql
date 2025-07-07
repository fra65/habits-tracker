/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_profile` DROP FOREIGN KEY `fk_users`;

-- DropTable
DROP TABLE `test`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(60) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `email_UNIQUE`(`email`),
    UNIQUE INDEX `username_UNIQUE`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_profile` ADD CONSTRAINT `fk_users` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
