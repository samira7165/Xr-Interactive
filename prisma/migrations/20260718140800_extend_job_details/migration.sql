-- AlterTable
ALTER TABLE `Job`
  ADD COLUMN `slug` VARCHAR(191) NOT NULL,
  ADD COLUMN `level` VARCHAR(191) NULL,
  ADD COLUMN `compensation` VARCHAR(191) NULL,
  ADD COLUMN `responsibilities` JSON NULL,
  ADD COLUMN `images` JSON NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Job_slug_key` ON `Job`(`slug`);
