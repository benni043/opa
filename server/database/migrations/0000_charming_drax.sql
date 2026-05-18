CREATE TABLE `countries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country` text NOT NULL,
	`country_code` text NOT NULL,
	`language_type` text NOT NULL,
	`capital` text NOT NULL,
	`currency` text NOT NULL,
	`domain` text NOT NULL,
	`traffic` text NOT NULL,
	`death_penalty` integer NOT NULL,
	`gdp_per_capita` real NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `countries_country_unique` ON `countries` (`country`);--> statement-breakpoint
CREATE UNIQUE INDEX `countries_country_code_unique` ON `countries` (`country_code`);--> statement-breakpoint
CREATE TABLE `country_languages` (
	`country_id` integer NOT NULL,
	`language_id` integer NOT NULL,
	`speakers` integer NOT NULL,
	PRIMARY KEY(`country_id`, `language_id`),
	FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `country_organizations` (
	`country_id` integer NOT NULL,
	`organization_id` integer NOT NULL,
	PRIMARY KEY(`country_id`, `organization_id`),
	FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `languages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `languages_name_unique` ON `languages` (`name`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_name_unique` ON `organizations` (`name`);