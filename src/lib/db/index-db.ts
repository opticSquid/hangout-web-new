import Dexie, { type Table } from "dexie";
import type { Post } from "../types/post";

export class PostsDB extends Dexie {
  posts!: Table<Post, string>;

  constructor() {
    super("PostsDatabase");
    this.version(1).stores({
      posts: "postId, distance", // Primary key + indexed field
    });
  }
}

export const db = new PostsDB();

export async function SavePostsToDB(posts: Post[]) {
  await db.posts.bulkPut(posts); // stores all fields of each Post object
}

export async function LoadNPosts(
  offset: number,
  limit: number
): Promise<Post[]> {
  return db.posts.orderBy("distance").offset(offset).limit(limit).toArray();
}
export async function TotalPostCount(): Promise<number> {
  return db.posts.count();
}
