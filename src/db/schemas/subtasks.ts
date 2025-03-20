import { sqliteTable, text, integer,  } from "drizzle-orm/sqlite-core"
import { sql } from 'drizzle-orm';
import { taskStatus } from "@/constants/status";
import { tasks } from "./task";

export const subTasks = sqliteTable('sub_tasks', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  body: text('body'),
  status: text('status', { enum: Object.values(taskStatus) as [string, ...string[]] }).notNull().default(taskStatus.TO_DO),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }),
  taskId: integer('task_id').notNull().references(() => tasks.id),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type SubTask = typeof subTasks.$inferSelect
export type NewSubTask = typeof subTasks.$inferInsert