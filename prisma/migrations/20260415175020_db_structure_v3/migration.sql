/*
  Warnings:

  - You are about to drop the `Bag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Bag`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `name` VARCHAR(100) NULL,
    `email` VARCHAR(255) NULL,
    `bagNo` VARCHAR(10) NOT NULL,
    `status` ENUM('SUBMITTED', 'READY', 'COLLECTED') NOT NULL DEFAULT 'SUBMITTED',
    `lastCollectedBy` INTEGER NULL,
    `lastSubmitted` DATETIME(3) NULL,
    `lastReady` DATETIME(3) NULL,
    `lastCollected` DATETIME(3) NULL,

    UNIQUE INDEX `User_bagNo_key`(`bagNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
