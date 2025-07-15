import Dexie, { type Table } from "dexie";
import type { Post } from "../types/posts";

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
  return new Promise((resolve) => {
    resolve(
      db.posts
        .orderBy("distance")
        .reverse()
        .offset(offset)
        .limit(limit)
        .toArray()
    );
  });
}
