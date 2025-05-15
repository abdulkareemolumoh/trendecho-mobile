import React, { useState, useCallback } from "react";
import { ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import { Link } from "expo-router";
import { useGetLatestPosts } from "@/components/firebase/hooks/usePosts";
import { getPaginatedPosts } from "@/components/firebase/hooks/useApis";
import Posts from "@/components/shared/posts";

export default function Index() {
  const { data: latest } = useGetLatestPosts("posts");

  const [refreshing, setRefreshing] = useState(false);

  const pageSize = 4;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getPaginatedPosts(pageSize);
    setRefreshing(false);
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

      <Posts />
    </ScrollView>
  );
}
