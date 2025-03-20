CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`body` text,
	`status` text DEFAULT 'TO_DO' NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
