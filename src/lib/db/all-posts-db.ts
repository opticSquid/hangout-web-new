import Dexie, { type Table } from "dexie";
import type { Post } from "../types/post";

export class AllPostsDB extends Dexie {
  posts!: Table<Post, string>;

  constructor() {
    super("AllPostsDatabase");
    this.version(1).stores({
      posts: "postId, distance", // Primary key + indexed field
    });
  }
}

export const db = new AllPostsDB();

export async function SavePostsToDB(posts: Post[]) {
  await db.posts.bulkPut(posts); // stores all fields of each Post object
}

/**
 * Loads a specific number of posts from the database.
 * @param offset The starting point for loading posts.
 * @param limit The maximum number of posts to load.
 * @returns A promise that resolves to an array of posts sorted by distance in descending order so that most nearest posts comes first.
 */
export async function LoadNPosts(
  offset: number,
  limit: number
): Promise<Post[]> {
  return db.posts.orderBy("distance").offset(offset).limit(limit).toArray();
}
export async function TotalPostCount(): Promise<number> {
  return db.posts.count();
}
