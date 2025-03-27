CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`content` text,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
