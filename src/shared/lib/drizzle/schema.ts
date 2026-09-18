import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  // Every user is anonymous, so this is always true. better-auth's anonymous plugin owns the
  // column and reads it on every session, so it stays until the plugin stops needing it.
  isAnonymous: boolean("is_anonymous").default(false),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

export const post = pgTable(
  "post",
  {
    id: text("id").primaryKey(),
    // A ghost is stored with no author, so it can't be traced back to anyone
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    // With the time zone: a naive timestamp is written in the server's local time and read back
    // as UTC, which breaks both the expiry filter and the feed's cursor
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    // When the post reaches the end of its lifespan and stops being shown
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    // The feed reads the newest posts that haven't expired
    index("post_createdAt_idx").on(table.createdAt),
    // The purge reads the expired ones
    index("post_expiresAt_idx").on(table.expiresAt),
    index("post_userId_idx").on(table.userId),
  ],
);

export const postReaction = pgTable(
  "post_reaction",
  {
    postId: text("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reaction: text("reaction").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  // Leads with post_id, so it also serves the feed's lookup of a page's reactions
  (table) => [
    primaryKey({ columns: [table.postId, table.userId, table.reaction] }),
    index("post_reaction_userId_idx").on(table.userId),
  ],
);

export const postView = pgTable(
  "post_view",
  {
    postId: text("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  // One view per user per post; leads with post_id, so it also serves the feed's count
  (table) => [
    primaryKey({ columns: [table.postId, table.userId] }),
    index("post_view_userId_idx").on(table.userId),
  ],
);

export const comment = pgTable(
  "comment",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // A post's comments are read oldest first, and by id for the ones that share a moment
    index("comment_postId_createdAt_idx").on(table.postId, table.createdAt, table.id),
    index("comment_userId_idx").on(table.userId),
  ],
);

export const commentReaction = pgTable(
  "comment_reaction",
  {
    commentId: text("comment_id")
      .notNull()
      .references(() => comment.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reaction: text("reaction").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  // Leads with comment_id, so it also serves the lookup of a page's reactions
  (table) => [
    primaryKey({ columns: [table.commentId, table.userId, table.reaction] }),
    index("comment_reaction_userId_idx").on(table.userId),
  ],
);

export const commentView = pgTable(
  "comment_view",
  {
    commentId: text("comment_id")
      .notNull()
      .references(() => comment.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  // One view per user per comment; leads with comment_id, so it also serves the count
  (table) => [
    primaryKey({ columns: [table.commentId, table.userId] }),
    index("comment_view_userId_idx").on(table.userId),
  ],
);

export const media = pgTable(
  "media",
  {
    id: text("id").primaryKey(),
    // Every owner is set to null rather than cascading: a row left with no post and no comment is
    // how the sweep finds a file to delete from Blob, which a cascade would erase along with it
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    postId: text("post_id").references(() => post.id, { onDelete: "set null" }),
    commentId: text("comment_id").references(() => comment.id, { onDelete: "set null" }),
    // Where the file lives in the Blob store, recorded when its upload is authorised
    pathname: text("pathname").notNull().unique(),
    kind: text("kind").notNull(),
    // Known once the upload is confirmed, from the store itself rather than the browser
    url: text("url"),
    contentType: text("content_type"),
    size: integer("size"),
    width: integer("width"),
    height: integer("height"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    attachedAt: timestamp("attached_at", { withTimezone: true }),
  },
  (table) => [
    index("media_postId_idx").on(table.postId),
    index("media_commentId_idx").on(table.commentId),
    index("media_userId_idx").on(table.userId),
    // What the sweep reads: files with nothing left to belong to
    index("media_orphan_idx")
      .on(table.createdAt)
      .where(sql`${table.postId} is null and ${table.commentId} is null`),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  posts: many(post),
}));

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
