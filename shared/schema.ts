import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"), // 'admin' or 'user'
});

export const projectZones = pgTable("project_zones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'agricultural', 'residence', 'community', 'retreat', 'infrastructure'
  budget: text("budget").notNull(),
  timeline: text("timeline").notNull(),
  monthlyRevenue: text("monthly_revenue").notNull(),
  description: text("description").notNull(),
  features: jsonb("features").notNull(), // array of strings
  investment: text("investment").notNull(),
  status: text("status").notNull(),
  imageUrl: text("image_url").notNull(),
  coordinates: jsonb("coordinates").notNull(), // polygon coordinates
  color: text("color").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  passwordHash: true,
  role: true,
});

export const loginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const insertProjectZoneSchema = createInsertSchema(projectZones).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ProjectZone = typeof projectZones.$inferSelect;
export type InsertProjectZone = z.infer<typeof insertProjectZoneSchema>;
