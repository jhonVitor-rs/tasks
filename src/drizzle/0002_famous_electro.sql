PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sub_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`body` text,
	`status` text DEFAULT 'TO_DO' NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`task_id` integer NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sub_tasks`("id", "name", "body", "status", "start_date", "end_date", "task_id", "updated_at", "created_at") SELECT "id", "name", "body", "status", "start_date", "end_date", "task_id", "updated_at", "created_at" FROM `sub_tasks`;--> statement-breakpoint
DROP TABLE `sub_tasks`;--> statement-breakpoint
ALTER TABLE `__new_sub_tasks` RENAME TO `sub_tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`body` text,
	`status` text DEFAULT 'TO_DO' NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "name", "body", "status", "start_date", "end_date", "updated_at", "created_at") SELECT "id", "name", "body", "status", "start_date", "end_date", "updated_at", "created_at" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;