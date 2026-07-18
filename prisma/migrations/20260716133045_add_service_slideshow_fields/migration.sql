-- AlterTable
ALTER TABLE `Service` ADD COLUMN `features` JSON NULL,
    ADD COLUMN `gradient` VARCHAR(191) NULL,
    ADD COLUMN `images` JSON NULL,
    ADD COLUMN `tag` VARCHAR(191) NULL;
