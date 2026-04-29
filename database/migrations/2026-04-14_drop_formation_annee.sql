-- Migration: remove obsolete column `annee` from table `formation`
-- MySQL 8+

ALTER TABLE formation DROP COLUMN IF EXISTS annee;
