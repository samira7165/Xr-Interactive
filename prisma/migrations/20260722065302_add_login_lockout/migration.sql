-- AlterTable
ALTER TABLE `LoginAttempt` ADD COLUMN `lockedUntil` DATETIME(3) NULL,
    ADD COLUMN `lockoutStage` INTEGER NOT NULL DEFAULT 0;
