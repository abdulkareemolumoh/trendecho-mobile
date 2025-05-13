import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { db, storage } from "../config";
import { getDownloadURL, ref } from "firebase/storage";

// Function to get a document from Firestore
export const getDocument = async (collection: string, docId: string) => {
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    let downloadURL = "";

    try {
      downloadURL = await getDownloadURL(ref(storage, `images/${data.title}`));
    } catch (error) {
      console.warn(`Could not fetch image for post "${data.title}":`, error);
    }

    return { id: docId, ...data, downloadURL };
  } else {
    throw new Error("No such document!");
  }
};

export const getLatestDocument = async (collectionName: string) => {
  const q = query(
    collection(db, collectionName),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;

  const doc = querySnapshot.docs[0];

  const downloadURL = await getDownloadURL(
    ref(storage, `images/${doc.data().title}`)
  );

  return { id: doc.id, ...doc.data(), downloadURL };
};

export const getPaginatedPosts = async (
  pageSize: number,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>
) => {
  const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];

  const postQuery = startAfterDoc
    ? query(collection(db, "posts"), ...constraints, startAfter(startAfterDoc))
    : query(collection(db, "posts"), ...constraints);

  const documentSnapshots = await getDocs(postQuery);

  if (documentSnapshots.empty) return null;

  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

  // Map over docs and fetch downloadURL for each
  const posts = await Promise.all(
    documentSnapshots.docs.map(async (doc) => {
      const data = doc.data();
      let downloadURL = "";

      try {
        downloadURL = await getDownloadURL(
          ref(storage, `images/${data.title}`)
        );
      } catch (error) {
        console.warn(`Could not fetch image for post "${data.title}":`, error);
      }

      return {
        id: doc.id,
        ...data,
        downloadURL,
      };
    })
  );

  return { posts, lastVisible };
};
