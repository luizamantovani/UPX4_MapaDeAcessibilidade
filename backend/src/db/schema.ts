import { pgTable, serial, text, timestamp, geometry, index } from "drizzle-orm/pg-core";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   username: text("username").notNull().unique(),
//   email: text("email").notNull().unique(),
//   password: text("password").notNull(),
//   createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
// });

export const pins = pgTable(
  "pins", 
  {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  userId: text("user_id"),
  category: text("category").notNull(),

  location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('spatial_index').using('gist', t.location),
  ]
);