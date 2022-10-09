SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `url_shortener`
--
CREATE DATABASE IF NOT EXISTS `MIT` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `MIT`;

-- --------------------------------------------------------

DROP TABLE IF EXISTS `transaction`;
DROP TABLE IF EXISTS `wallet`;

CREATE TABLE `wallet` (
  `address` varchar(44) NOT NULL PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `wallet` (`address`) VALUES
('5LgMR5eedW6MooKdmmgJ1ztquxko4WzCuP5xKEh4xx65'),
('G3iGKuXUdmtTQjCnkP87kL9PZBTatd4jxJLRwYTa219L');

CREATE TABLE `transaction` (
  `transaction_id` varchar(88) NOT NULL PRIMARY KEY,
  `wallet_address` varchar(44),
  FOREIGN KEY (wallet_address) REFERENCES wallet(address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `transaction` (`transaction_id`, `wallet_address`) VALUES
('Z1irdmWCawnLLk4bu7Vh8kx7hnr4LrXcp5oikRdY4E7CdnX7TG8boXfuFNSQppisL5fmebpt44jwrJCo1V7fLeg', '5LgMR5eedW6MooKdmmgJ1ztquxko4WzCuP5xKEh4xx65'),
('9RYFsghmnFAaJ51XDAmLdnhJK7wfW4D1GfAFkTTaKdYzFV2VByeHNbXTBELwnazyN2BPH1Y39ca8ftJ7xjo88vQ', '5LgMR5eedW6MooKdmmgJ1ztquxko4WzCuP5xKEh4xx65'),
('3jHKYBD1UEUFqyg2FvvofwzqZvwocru9vmbMHwf3SAD25zuTdpyfKeCpkCojDAx1Ba6kroZnrb6uf2pZDdawKXus', 'G3iGKuXUdmtTQjCnkP87kL9PZBTatd4jxJLRwYTa219L'),
('bcw2BeGMotKMZeRSRuyBG6GZBSidYqXwd4LBEhUjFENuCMqBZL9wFtnSaMbRq4wp7e848Bs8xxDUVbSFBzqTtxu', 'G3iGKuXUdmtTQjCnkP87kL9PZBTatd4jxJLRwYTa219L');