import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { GenId } from "../services/genUUID";

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey().$defaultFn(() => GenId()),
  title: text('name').notNull(),
  content: text('content', {mode: 'text'}),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
})

export type Note = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert