import Dexie, { type Table } from "dexie";
import type { ProfilePost } from "../types/post";

export class MyPostsDB extends Dexie {
  posts!: Table<ProfilePost, string>;

  constructor() {
    super("MyPostsDatabase");
    this.version(1).stores({
      posts: "postId, createdAt", // Primary key + indexed field
    });
  }
}

export const db = new MyPostsDB();

export async function SavePostsToDB(posts: ProfilePost[]) {
  await db.posts.bulkPut(posts); // stores all fields of each Post object
}

/**
 * Loads a specific number of posts from the database.
 * @param offset The starting point for loading posts.
 * @param limit The maximum number of posts to load.
 * @returns A promise that resolves to an array of posts sorted by creation date in descending order so that most recent posts comes first.
 */
export async function LoadNPosts(
  offset: number,
  limit: number
): Promise<ProfilePost[]> {
  return db.posts
    .orderBy("createdAt")
    .reverse()
    .offset(offset)
    .limit(limit)
    .toArray();
}
export async function TotalPostCount(): Promise<number> {
  return db.posts.count();
}
