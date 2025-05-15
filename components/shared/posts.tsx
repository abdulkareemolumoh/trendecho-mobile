import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { Avatar, Card, IconButton, Button } from "react-native-paper";
import { Link } from "expo-router";
import { Post, useGetPaginatedPosts } from "../firebase/hooks/usePosts";
import { getPaginatedPosts } from "../firebase/hooks/useApis";

const Posts = () => {
  const { data, isLoading } = useGetPaginatedPosts();
  const [posts, setPosts] = useState<Post[]>([]);

  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (data) {
      setPosts(data.posts);
      setLastVisible(data.lastVisible);
      setHasMore(data.hasMore);
    }
  }, [data]);

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPageData = await getPaginatedPosts(lastVisible);
      setPosts([...posts, ...nextPageData.posts]);
      setLastVisible(nextPageData.lastVisible);
      setHasMore(nextPageData.hasMore);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 64 }}>
      {isLoading ? (
        <Text className="text-center my-4">Loading posts...</Text>
      ) : (
        <>
          {posts.map((post) => (
            <Link href={`/${post.id}`} key={post.id} asChild>
              <TouchableOpacity activeOpacity={0.9}>
                <Card style={{ marginBottom: 16, borderRadius: 10 }}>
                  <Card.Title
                    title={post.title}
                    subtitle={post.postedBy}
                    left={(props) => (
                      <Avatar.Image
                        {...props}
                        source={{ uri: post.downloadURL ?? undefined }}
                        size={48}
                      />
                    )}
                    right={(props) => (
                      <IconButton
                        {...props}
                        icon="dots-vertical"
                        onPress={() => {}}
                      />
                    )}
                  />
                </Card>
              </TouchableOpacity>
            </Link>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <View className="mb-8 mt-2">
              <Button
                mode="contained"
                onPress={handleLoadMore}
                loading={isLoadingMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </Button>
            </View>
          )}

          {/* No More Posts Message */}
          {!hasMore && posts.length > 0 && (
            <Text className="text-center text-gray-500 my-4">
              No more posts to load
            </Text>
          )}

          {/* Empty State Message */}
          {!isLoading && posts.length === 0 && (
            <View className="items-center justify-center py-8">
              <Text className="text-lg text-gray-600 mb-2">No posts found</Text>
              <Text className="text-gray-500">
                Check back later for new content
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default Posts;
