import React, { useEffect, useState } from "react";
import { Button, ScrollView, View, ActivityIndicator } from "react-native";
import { Avatar, Card, IconButton, Text } from "react-native-paper";
import { useGetLatestPosts } from "@/components/firebase/hooks/usePosts";
import { getPaginatedPosts } from "@/components/firebase/hooks/useApis";
import { Link } from "expo-router";

export default function Index() {
  const { data: Latest } = useGetLatestPosts("posts");

  const [posts, setPosts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  const pageSize = 4;

  const fetchInitialPosts = async () => {
    setLoading(true);
    const result = await getPaginatedPosts(pageSize);
    if (result) {
      setPosts(result.posts);
      setLastDoc(result.lastVisible);
      setEndReached(result.posts.length < pageSize);
    }
    setLoading(false);
  };

  const loadMore = async () => {
    if (loading || endReached) return;

    setLoading(true);
    const result = await getPaginatedPosts(pageSize, lastDoc);
    if (result) {
      setPosts((prev) => [...prev, ...result.posts]);
      setLastDoc(result.lastVisible);
      setEndReached(result.posts.length < pageSize);
    } else {
      setEndReached(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  return (
    <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 24 }}>
      {Latest && (
        <Link href={`/${Latest.id}`} asChild>
          <Card className="">
            <Card.Content className="gap-2">
              <Card.Cover source={{ uri: Latest.downloadURL }} />
              <Text variant="titleLarge">{Latest.title}</Text>
            </Card.Content>
          </Card>
        </Link>
      )}
      <View className="pt-8">
        <Text variant="titleMedium">Latest News</Text>
        {posts.map((post) => (
          <Link href={`/${post.id}`} key={post.id} asChild>
            <Card className="mb-4">
              <Card.Title
                title={
                  post.title.length > 30
                    ? post.title.substring(0, 30) + "..."
                    : post.title
                }
                subtitle={post.postedBy}
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={{ uri: post.downloadURL }}
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
          </Link>
        ))}

        {!endReached && (
          <View className="mb-4 mx-auto w-fit rounded-lg ">
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Button onPress={loadMore} disabled={loading} title="Load More" />
            )}
          </View>
        )}

        {endReached && posts.length > 0 && (
          <Text className="text-center my-8 mx-auto w-fit">No more posts</Text>
        )}
      </View>
    </ScrollView>
  );
}
