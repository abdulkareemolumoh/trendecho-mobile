import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
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
import { getPaginatedPosts } from "@/components/firebase/hooks/useApis";
import { useGetLatestPosts } from "../firebase/hooks/usePosts";

const Category = () => {
  const theme = useTheme();

  const [posts, setPosts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  const pageSize = 4;
  const { data } = useGetLatestPosts("posts", 2, "Health");

  //   const fetchInitialPosts = async () => {
  //     setLoading(true);
  //     const result = await useGetLatestPosts("posts", "General", 3);
  //     if (result) {
  //       setPosts(result.posts);
  //       setLastDoc(result.lastVisible);
  //       setEndReached(result.posts.length < pageSize);
  //     }
  //     setLoading(false);
  //   };
 { console.log("latest", data.length);}
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

  //   useEffect(() => {
  //     fetchInitialPosts();
  //   }, []);

  return (
    <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 48 }}>
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
};

export default Category;
