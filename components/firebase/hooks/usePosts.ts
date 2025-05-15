import { useQuery } from "@tanstack/react-query";
import { getDocument, getLatestDocument, getPaginatedPosts } from "./useApis";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const useGetPosts = (collection: string, docId: string) => {
  return useQuery<any>({
    queryKey: ["post", collection, docId],
    queryFn: () => getDocument(collection, docId),
  });
};

export const useGetLatestPosts = (
  collectionName: string,
  limitCount?: number,
  category?: string
) => {
  return useQuery<any>({
    queryKey: ["latestPost", collectionName],
    queryFn: () => getLatestDocument(collectionName, limitCount, category),
  });
};

export const useGetPaginatedPosts = (
  pageSize: number,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>
) => {
  return useQuery({
    queryKey: ["posts", startAfterDoc?.id || "first"],
    queryFn: () => getPaginatedPosts(pageSize, startAfterDoc),
  });
};
