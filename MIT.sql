SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `url_shortener`
--
CREATE DATABASE IF NOT EXISTS `MIT` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `MIT`;

-- --------------------------------------------------------

DROP TABLE IF EXISTS `wallet`;

CREATE TABLE `wallet` (
  `address` varchar(44) NOT NULL PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `wallet` (`address`) VALUES
('5LgMR5eedW6MooKdmmgJ1ztquxko4WzCuP5xKEh4xx65');

DROP TABLE IF EXISTS `transaction`;

CREATE TABLE `transaction` (
  `transaction_id` varchar(88) NOT NULL PRIMARY KEY,
  `wallet_address` varchar(44),
  FOREIGN KEY (wallet_address) REFERENCES wallet(address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `transaction` (`transaction_id`, `wallet_address`) VALUES
('2RScjXvq5vkpkWMaShvLFdXbEKm7eNLUQRQgTtmpnbFGLaeYa8av9qP7LfY4n1rr1wZH76m3wwfAkP9eyCht3DAM', '5LgMR5eedW6MooKdmmgJ1ztquxko4WzCuP5xKEh4xx65');