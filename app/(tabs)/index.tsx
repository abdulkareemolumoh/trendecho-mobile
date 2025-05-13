import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  Avatar,
  Card,
  IconButton,
  Text,
  Button,
  useTheme,
} from "react-native-paper";
import { Link } from "expo-router";
import { useGetLatestPosts } from "@/components/firebase/hooks/usePosts";
import { getPaginatedPosts } from "@/components/firebase/hooks/useApis";

export default function Index() {
  const theme = useTheme();
  const { data: latest } = useGetLatestPosts("posts");

  const [posts, setPosts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInitialPosts();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  return (
    <ScrollView
      className="px-4"
      contentContainerStyle={{ paddingBottom: 48 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Hero Section */}
      {latest && (
        <Link href={`/${latest.id}`} asChild>
          <TouchableOpacity activeOpacity={0.9}>
            <Card
              style={{ borderRadius: 12, overflow: "hidden", marginBottom: 20 }}
            >
              <Card.Cover source={{ uri: latest.downloadURL }} />
              <Card.Content>
                <Text variant="titleLarge" className="mt-2 font-semibold">
                  {latest.title}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </Link>
      )}

      {/* Posts Section */}
      <Text variant="titleMedium" className="mb-4 text-gray-700">
        Latest News
      </Text>

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
          </TouchableOpacity>
        </Link>
      ))}

      {/* Load More Button */}
      {!endReached && (
        <View className="mt-4 mb-8 mx-auto">
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <Button
              mode="contained-tonal"
              onPress={loadMore}
              disabled={loading}
              style={{ borderRadius: 20 }}
            >
              Load More
            </Button>
          )}
        </View>
      )}

      {/* End Reached Message */}
      {endReached && posts.length > 0 && (
        <Text
          className="text-center my-8 text-gray-500"
          style={{ fontStyle: "italic" }}
        >
          No more posts
        </Text>
      )}
    </ScrollView>
  );
}
