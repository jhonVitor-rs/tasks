import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { taskStatus } from "@/constants/status";
import { GenId } from "../services/genUUID";

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey().$defaultFn(() => GenId()),
  name: text('name').notNull(),
  body: text('body'),
  status: text('status', { enum: Object.values(taskStatus) as [string, ...string[]] }).notNull().default(taskStatus.TO_DO),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert