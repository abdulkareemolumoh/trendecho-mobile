import { useQuery } from "@tanstack/react-query";
import { getLatestPosts, getPaginatedPosts, getPostsById } from "./useApis";

export type Post = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  downloadURL: string | null;
  postedBy: string;
  createdAt: {
    date: string;
    time: string;
    timestamp: string; // or Date if you're converting it to JS Date
  };
};

export const useGetPaginatedPosts = () => {
  return useQuery<any>({
    queryKey: ["posts"],
    queryFn: () => getPaginatedPosts(),
  });
};
export const useGetLatestPosts = () => {
  return useQuery<any>({
    queryKey: ["latestPosts"],
    queryFn: () => getLatestPosts(),
  });
};

export const useGetPostsById = (id: string) => {
  return useQuery<any>({
    queryKey: ["posts", id],
    queryFn: () => getPostsById(id),
  });
};
