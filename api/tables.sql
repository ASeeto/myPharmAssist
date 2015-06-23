--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `url` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `class` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL
);

--
-- Table structure for table `pharmacies`
--

CREATE TABLE IF NOT EXISTS `pharmacies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `website` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contact` char(255) COLLATE utf8_unicode_ci DEFAULT NULL
);

--
-- Table structure for table `prescriptions`
--

CREATE TABLE IF NOT EXISTS `prescriptions` (
  `id` int(11) NOT NULL,
  `medication` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `strength` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `route` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `frequency` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `dispense` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `refills` int(11) NOT NULL
);

--
-- Table structure for table `profileprescriptions`
--

CREATE TABLE IF NOT EXISTS `profileprescriptions` (
  `id` int(11) NOT NULL,
  `profile_id` int(11) NOT NULL,
  `prescription_id` int(11) NOT NULL
);

--
-- Table structure for table `profiles`
--

CREATE TABLE IF NOT EXISTS `profiles` (
  `id` int(11) NOT NULL,
  `name` char(25) COLLATE utf8_unicode_ci DEFAULT 'Other',
  `color` char(7) COLLATE utf8_unicode_ci DEFAULT '#eeeeee'
);

--
-- Table structure for table `userevents`
--

CREATE TABLE IF NOT EXISTS `userevents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL
);

--
-- Table structure for table `userprofiles`
--

CREATE TABLE IF NOT EXISTS `userprofiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `profile_id` int(11) NOT NULL
);

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `email` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` char(255) COLLATE utf8_unicode_ci NOT NULL
);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacies`
--
ALTER TABLE `pharmacies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profileprescriptions`
--
ALTER TABLE `profileprescriptions`
  ADD PRIMARY KEY (`id`), ADD KEY `profile_id` (`profile_id`), ADD KEY `prescription_id` (`prescription_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userevents`
--
ALTER TABLE `userevents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userprofiles`
--
ALTER TABLE `userprofiles`
  ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`), ADD KEY `profile_id` (`profile_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `pharmacies`
--
ALTER TABLE `pharmacies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `profileprescriptions`
--
ALTER TABLE `profileprescriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `userevents`
--
ALTER TABLE `userevents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `userprofiles`
--
ALTER TABLE `userprofiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
