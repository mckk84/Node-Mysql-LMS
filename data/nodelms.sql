-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2023 at 10:24 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodelms`
--

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `instructor_id` int(11) NOT NULL,
  `status` varchar(25) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `course_id`, `student_id`, `score`, `remarks`, `instructor_id`, `status`, `created_at`) VALUES
(1, 3, 4, 89, 'Well Done', 5, 'Updated', '2023-02-01 08:26:37'),
(2, 1, 4, NULL, NULL, 2, 'Requested', '2023-02-04 09:56:26');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `course_code` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(25) NOT NULL,
  `description` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `course_code`, `name`, `type`, `description`, `created_by`, `is_active`, `created_at`, `modified_at`) VALUES
(1, 'CU012', 'Tailwind CSS2', 'CSS2', 'Tailwind CSS works by scanning all of your HTML files, JavaScript components, and any other templates for class names, generating the corresponding styles and then writing them to a static CSS file.\n\nIt\'s fast, flexible, and reliable — with zero-runtime.', 2, 1, '2023-01-28 15:41:30', '2023-02-04 09:55:50'),
(3, 'CU02', 'React Js', 'JS', 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It is an open-source, component-based front-end library that is responsible only for the view layer of the application. ReactJS is not a framework, it is just a library developed by Facebook to solve some problems that we were facing earlier.', 5, 1, '2023-01-30 14:53:54', '2023-02-04 09:55:04');

-- --------------------------------------------------------

--
-- Table structure for table `course_assign`
--

CREATE TABLE `course_assign` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `assigned_by` int(11) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `status` varchar(15) NOT NULL DEFAULT 'Assigned',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_assign`
--

INSERT INTO `course_assign` (`id`, `course_id`, `student_id`, `assigned_by`, `notes`, `status`, `created_at`) VALUES
(2, 3, 4, 5, 'follow', 'Completed', '2023-01-31 08:14:38'),
(3, 1, 4, 2, 'tailwind css', 'Completed', '2023-01-31 10:21:39');

-- --------------------------------------------------------

--
-- Table structure for table `course_material`
--

CREATE TABLE `course_material` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `type` varchar(25) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_material`
--

INSERT INTO `course_material` (`id`, `course_id`, `type`, `link`, `description`, `created_at`) VALUES
(1, 3, 'content', '', 'React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies.', '2023-02-03 08:02:45'),
(10, 3, 'video', '16754187727011806263989060037174.mp4', '', '2023-02-03 10:06:12');

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `course_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `name`, `course_id`, `description`, `created_at`, `modified_at`) VALUES
(1, 'Lesson 1', 1, 'Introduction to Tailwind CSS.', '2023-01-29 16:56:48', NULL),
(2, 'Lesson 2', 1, 'How to get Started', '2023-01-29 17:13:37', NULL),
(3, 'Introduction', 3, 'Introduction to React js', '2023-01-30 14:55:39', NULL),
(4, 'React Js - Prereuisites', 3, 'Before getting into React Js, You should have good understanding of JavaScript, Event Emitters, Event Loop, OOPS in JS. ', '2023-01-30 14:57:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lesson_material`
--

CREATE TABLE `lesson_material` (
  `id` int(11) NOT NULL,
  `type` varchar(25) NOT NULL,
  `link` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_course_status`
--

CREATE TABLE `student_course_status` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_lesson_status`
--

CREATE TABLE `student_lesson_status` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `status` varchar(25) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_lesson_status`
--

INSERT INTO `student_lesson_status` (`id`, `student_id`, `course_id`, `lesson_id`, `status`, `created_at`, `modified_at`) VALUES
(1, 4, 3, 3, 'Completed', '2023-01-31 11:15:26', NULL),
(2, 4, 3, 4, 'Completed', '2023-01-31 11:15:40', NULL),
(3, 4, 1, 1, 'Completed', '2023-02-04 09:07:59', NULL),
(4, 4, 1, 2, 'Completed', '2023-02-04 09:56:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `type` enum('Student','Instructor','Admin') DEFAULT 'Student',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `mobile`, `dob`, `type`, `is_active`, `created_by`, `created_at`, `modified_at`) VALUES
(1, 'Admin', 'admin@gmail.com', '$2b$10$pySPAmLDUKMuK4YyQ3g3eOuRqimVl1X.yXAx61eLTVHb.HpECI4xi', NULL, NULL, 'Admin', 1, 0, '2023-01-27 10:19:17', '2023-02-05 09:22:12'),
(2, 'Instructor', 'instructor@gmail.com', '$2b$10$Wznucan18OPPF0vr0U542uZB1u1yiFbHMHlcPK/Av7VP86Ohx9/0.', '9980019504', '1985-04-01', 'Instructor', 1, 0, '2023-01-27 10:19:17', '2023-02-05 09:14:42'),
(4, 'Student1', 'student@gmail.com', '$2b$10$iapGPJpnwumqJQn5/bWUZ.Gxavicwd8V1oVvv/pj/FOoR/YjvH4.6', '', '0000-00-00', 'Student', 1, 2, '2023-01-29 08:26:05', '2023-02-05 09:14:09'),
(5, 'Instructor2', 'instructor2@gmail.com', '$2b$10$Wznucan18OPPF0vr0U542uZB1u1yiFbHMHlcPK/Av7VP86Ohx9/0.', '9980019504', '1985-04-01', 'Instructor', 1, 0, '2023-01-27 10:19:17', '2023-02-05 09:14:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_code` (`course_code`);

--
-- Indexes for table `course_assign`
--
ALTER TABLE `course_assign`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course_material`
--
ALTER TABLE `course_material`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lesson_material`
--
ALTER TABLE `lesson_material`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_lesson_status`
--
ALTER TABLE `student_lesson_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `course_assign`
--
ALTER TABLE `course_assign`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `course_material`
--
ALTER TABLE `course_material`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lesson_material`
--
ALTER TABLE `lesson_material`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_lesson_status`
--
ALTER TABLE `student_lesson_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
