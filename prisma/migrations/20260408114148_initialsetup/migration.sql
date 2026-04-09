-- CreateTable
CREATE TABLE `User` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `email` VARCHAR(255) NULL,
    `bagNo` VARCHAR(255) NOT NULL,
    `status` ENUM('SUBMITTED', 'READY', 'COLLECTED') NOT NULL DEFAULT 'COLLECTED',
    `lastCollectedBy` INTEGER NULL,
    `lastSubmitted` DATETIME(3) NULL,
    `lastReady` DATETIME(3) NULL,
    `lastCollected` DATETIME(3) NULL,

    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
