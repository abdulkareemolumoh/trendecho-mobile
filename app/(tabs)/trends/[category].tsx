import { getPaginatedPosts } from "@/components/firebase/hooks/useApis";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { useGetLatestPosts } from "../../../components/firebase/hooks/usePosts";

const Category = () => {
  const theme = useTheme();
  const { category } = useLocalSearchParams();

  const [posts, setPosts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  const pageSize = 4;
  const { data: initialPosts } = useGetLatestPosts(
    "posts",
    pageSize,
    category as string
  );

  // Initialize posts with initial data
  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts);
      // Assuming initialPosts returns the last document for pagination
      setLastDoc(initialPosts[initialPosts.length - 1]);
    }
  }, [initialPosts]);

  const loadMorePosts = async () => {
    if (loading || endReached) return;

    setLoading(true);
    try {
      const { posts: newPosts, lastVisible } = await getPaginatedPosts(
        "posts",
        pageSize,
        lastDoc,
        category as string
      );

      if (newPosts.length === 0) {
        setEndReached(true);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setLastDoc(newPosts[newPosts.length - 1]);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 48 }}>
      {posts &&
        posts.map((post) => (
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
              onPress={loadMorePosts}
              disabled={loading || endReached}
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
};

export default Category;
