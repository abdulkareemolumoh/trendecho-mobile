import {
  collection,
  query,
  limit,
  startAfter,
  getDocs,
  orderBy,
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config";
import { Post } from "./usePosts";

export const getPaginatedPosts = async (
  pageSize = 4,
  lastVisibleDoc = null,
  category?: string
) => {
  try {
    const postsQuery = lastVisibleDoc
      ? query(
          collection(db, "posts"),
          startAfter(lastVisibleDoc),
          limit(pageSize)
        )
      : category && lastVisibleDoc
      ? query(
          collection(db, "posts"),
          startAfter(lastVisibleDoc),
          limit(pageSize),
          where("category", "==", category)
        )
      : category
      ? query(
          collection(db, "posts"),
          limit(pageSize),
          where("category", "==", category)
        )
      : query(collection(db, "posts"), limit(pageSize));

    const documentSnapshots = await getDocs(postsQuery);

    if (documentSnapshots.empty) {
      return { posts: [], lastVisible: null, hasMore: false };
    }

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    const postsPromises = documentSnapshots.docs.map(async (doc) => {
      const post = { id: doc.id, ...doc.data() } as Post;

      try {
        const downloadURL = await getDownloadURL(
          ref(storage, `images/${post.title}`)
        );
        return { ...post, downloadURL };
      } catch (error) {
        console.warn(`Image not found for post: ${post.title}`, error);
        return { ...post, downloadURL: null };
      }
    });

    const posts = await Promise.all(postsPromises);

    return {
      posts,
      lastVisible,
      hasMore: posts.length === pageSize,
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    throw error;
  }
};

export const getLatestPosts = async () => {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  const posts: Post[] = [];
  querySnapshot.forEach((doc) => {
    const post = { id: doc.id, ...doc.data() } as Post;
    posts.push(post);
  });
  const downloadURL = await getDownloadURL(
    ref(storage, `images/${posts[0].title}`)
  );
  return { ...posts[0], downloadURL };
};

export const getPostsById = async (id: string): Promise<Post | null> => {
  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();

    let downloadURL = "";
    if (data?.title) {
      try {
        downloadURL = await getDownloadURL(
          ref(storage, `images/${data.title}`)
        );
      } catch (imageError) {
        console.error(`Failed to fetch image for post ${id}:`, imageError);
      }
    }

    return {
      id: docSnap.id,
      ...(data as Omit<Post, "id" | "downloadURL">),
      downloadURL,
    };
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
};
