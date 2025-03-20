import { sqliteTable, text, integer,  } from "drizzle-orm/sqlite-core"
import { sql } from 'drizzle-orm';

export const taskStatus = {
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED'
} as const;

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  body: text('body'),
  status: text('status', { enum: Object.values(taskStatus) as [string, ...string[]] }).notNull().default(taskStatus.TO_DO),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert