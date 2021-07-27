-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 27 Tem 2021, 15:27:05
-- Sunucu sürümü: 10.4.20-MariaDB
-- PHP Sürümü: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `quizsistemi`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `answer` varchar(4) DEFAULT NULL,
  `quizid` int(24) DEFAULT NULL,
  `questionid` int(24) DEFAULT NULL,
  `questionnumber` int(24) DEFAULT 1,
  `answeredby` int(24) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Tablo döküm verisi `answers`
--

INSERT INTO `answers` (`id`, `answer`, `quizid`, `questionid`, `questionnumber`, `answeredby`) VALUES
(101, 'C', 14, 9, 1, 3),
(102, 'A', 14, 9, 1, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `exams`
--

CREATE TABLE `exams` (
  `id` int(11) NOT NULL,
  `active` int(2) NOT NULL DEFAULT 1,
  `grade` int(2) DEFAULT NULL,
  `multisection` int(2) NOT NULL DEFAULT 0,
  `multigrade` int(2) NOT NULL DEFAULT 0,
  `section` varchar(4) NOT NULL DEFAULT 'YOK',
  `examname` varchar(48) DEFAULT NULL,
  `examdetails` varchar(64) DEFAULT NULL,
  `startdate` datetime NOT NULL DEFAULT current_timestamp(),
  `enddate` datetime NOT NULL DEFAULT current_timestamp(),
  `startkey` varchar(256) DEFAULT NULL,
  `createdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Tablo döküm verisi `exams`
--

INSERT INTO `exams` (`id`, `active`, `grade`, `multisection`, `multigrade`, `section`, `examname`, `examdetails`, `startdate`, `enddate`, `startkey`, `createdate`) VALUES
(6, 1, 11, 1, 0, 'YOK', 'TYT-1', 'Türkiye Geneli TYT-1', '2021-07-25 16:30:00', '2021-07-28 00:13:00', 'b69a92fb7160169a701210386e76e5b9', '2021-06-30 13:30:39'),
(7, 1, 11, 0, 0, 'DİL', 'Dilko-1', 'Türkiye Geneli Dilko-1', '2021-07-23 15:43:00', '2021-07-29 16:43:00', 'cb1eca005653c6867c6081aafa3650d1', '2021-07-25 16:43:25');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `quizid` int(24) DEFAULT NULL,
  `image` varchar(512) DEFAULT NULL,
  `correctanswer` varchar(2) DEFAULT NULL,
  `questionnumber` int(3) NOT NULL DEFAULT 1,
  `createdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Tablo döküm verisi `questions`
--

INSERT INTO `questions` (`id`, `description`, `quizid`, `image`, `correctanswer`, `questionnumber`, `createdate`) VALUES
(9, 'Paragrafta Başlık', 14, '..\\files\\images\\quizid-14\\questionid-9/af641273406c7369304cc13ec4ff7b4f.png', 'A', 1, '2021-06-30 15:27:13'),
(13, 'Üçgende Açılar', 19, '..\\files\\images\\quizid-19\\questionid-13/8b9743b2b59d6312fe9e743d20dbfbd7.png', 'B', 2, '2021-06-30 15:27:13'),
(19, 'Kombinasyon', 19, '..\\files\\images\\quizid-19\\questionid-19/f4993f1c525fb52119f5aba92bb53ff8.png', 'C', 1, '2021-07-24 14:27:06'),
(22, 'Permütasyon', 19, '..\\files\\images\\quizid-19\\questionid-19/f4993f1c525fb52119f5aba92bb53ff8.png', 'C', 3, '2021-07-24 14:27:06'),
(23, 'Osmanlı', 15, '..\\files\\images\\quizid-14\\questionid-9/af641273406c7369304cc13ec4ff7b4f.png', 'A', 1, '2021-06-30 15:27:13');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `quizs`
--

CREATE TABLE `quizs` (
  `id` int(11) NOT NULL,
  `examid` int(32) DEFAULT NULL,
  `quizname` varchar(64) DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT 1,
  `createdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Tablo döküm verisi `quizs`
--

INSERT INTO `quizs` (`id`, `examid`, `quizname`, `active`, `createdate`) VALUES
(14, 6, 'Türkçe', 1, '2021-06-30 13:56:11'),
(15, 6, 'Tarih', 1, '2021-06-30 13:56:29'),
(16, 6, 'Coğrafya', 1, '2021-06-30 13:57:20'),
(17, 6, 'Felsefe', 1, '2021-06-30 13:57:28'),
(18, 6, 'Din Kültürü ve Ahlak Bilgisi', 1, '2021-06-30 13:57:47'),
(19, 6, 'Matematik', 1, '2021-06-30 13:57:51'),
(20, 6, 'Geometri', 1, '2021-06-30 13:57:56'),
(21, 6, 'Fizik', 1, '2021-06-30 13:58:00'),
(22, 6, 'Kimya', 1, '2021-06-30 13:58:04'),
(23, 6, 'Biyoloji', 1, '2021-06-30 13:58:08'),
(24, 7, 'İngilizce', 1, '2021-07-25 16:43:50');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(64) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `grade` int(3) DEFAULT NULL,
  `section` varchar(4) NOT NULL DEFAULT 'YOK',
  `admin` int(2) NOT NULL DEFAULT 0,
  `createdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `grade`, `section`, `admin`, `createdate`) VALUES
(1, 'hamza', 'hamza', 11, 'DİL', 0, '2021-06-24 20:18:14'),
(3, 'naim', 'naim', 11, 'DİL', 0, '2021-06-26 23:21:32'),
(6, 'admin', 'admin', 99, 'YOK', 1, '2021-06-27 11:27:32');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `quizs`
--
ALTER TABLE `quizs`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- Tablo için AUTO_INCREMENT değeri `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Tablo için AUTO_INCREMENT değeri `quizs`
--
ALTER TABLE `quizs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
