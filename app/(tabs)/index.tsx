import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import { Link } from "expo-router";
import Posts from "@/components/shared/posts";
import { useGetLatestPosts } from "@/components/firebase/hooks/usePosts";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: latest, refetch } = useGetLatestPosts();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);
  return (
    <ScrollView
      className="px-4"
      contentContainerStyle={{ paddingBottom: 48 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {latest && (
        <Link href={`/${latest?.id}`} asChild>
          <TouchableOpacity activeOpacity={0.9}>
            <Card
              style={{ borderRadius: 12, overflow: "hidden", marginBottom: 20 }}
            >
              <Card.Cover source={{ uri: latest?.downloadURL }} />
              <Card.Content>
                <Text variant="titleLarge" className="mt-2 font-semibold">
                  {latest?.title}
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
