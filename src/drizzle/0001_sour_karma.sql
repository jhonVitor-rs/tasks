CREATE TABLE `sub_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`body` text,
	`status` text DEFAULT 'TO_DO' NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`task_id` integer NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
