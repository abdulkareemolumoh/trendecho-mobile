import { useGetPosts } from "@/components/firebase/hooks/usePosts";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
  Linking,
  Share,
  Alert,
} from "react-native";
import {
  Text,
  ActivityIndicator,
  Avatar,
  Divider,
  Chip,
  Card,
  Button,
} from "react-native-paper";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import HTMLView from "react-native-htmlview";
import { useMemo } from "react";

// Utility Components
const LoadingState = () => (
  <View className="flex-1 justify-center items-center p-5 bg-black">
    <ActivityIndicator size="large" color="#bb86fc" />
    <Text className="mt-4 text-base text-purple-300">Loading article...</Text>
  </View>
);

const ErrorState = ({ message }: { message: string }) => (
  <View className="flex-1 justify-center items-center p-5 bg-black">
    <AntDesign name="exclamationcircleo" size={48} color="#ef4444" />
    <Text className="mt-4 text-base text-red-400 text-center">
      Error loading article: {message || "Unknown error"}
    </Text>
  </View>
);

const ArticleHeader = ({
  title,
  postedBy,
  createdAt,
  category,
}: {
  title: string;
  postedBy: string;
  createdAt: any;
  category: string;
}) => (
  <View>
    <Text className="text-2xl font-bold mb-4 leading-8 text-white">
      {title}
    </Text>
    <View className="flex-row justify-between items-center mb-4">
      <View className="flex-row items-center">
        <Avatar.Text
          size={36}
          label={postedBy.charAt(0).toUpperCase()}
          style={{ backgroundColor: "#7c3aed" }}
        />
        <Text className="ml-2 text-base text-gray-300">{postedBy}</Text>
      </View>
      <View className="flex-row items-center">
        <AntDesign name="clockcircleo" size={16} color="#9ca3af" />
        <Text className="ml-1 text-sm text-gray-400">
          {createdAt?.date || "Unknown date"}
        </Text>
      </View>
    </View>
    <Chip
      mode="outlined"
      textStyle={{ color: "#d4d4d4" }}
      style={{
        borderColor: "#7c3aed",
        marginBottom: 16,
        alignSelf: "flex-start",
      }}
    >
      {category}
    </Chip>
  </View>
);

const VideoPlayer = ({ src }: { src: string }) => (
  <View className="bg-gray-800 p-4 my-4 rounded-lg items-center">
    <Ionicons name="play-circle-outline" size={48} color="#bb86fc" />
    <Text className="text-gray-300 mt-2 mb-3 text-center">
      Video content available
    </Text>
    <Button
      mode="contained"
      onPress={() => Linking.openURL(src)}
      buttonColor="#7c3aed"
    >
      Watch Video
    </Button>
  </View>
);

const processHTMLContent = (html: string) => {
  const iframes: string[] = [];
  const processedHtml = html.replace(
    /<iframe[^>]*?src=["'](.*?)["'][^>]*?><\/iframe>/g,
    (_, src) => {
      iframes.push(src);
      return `<iframe src="${src}"></iframe>`;
    }
  );
  return { processedHtml, iframes };
};

const NewsContent = () => {
  const { id } = useLocalSearchParams();
  const {
    data: post,
    isPending,
    isError,
    error,
  } = useGetPosts("posts", id as string);
  const { width } = useWindowDimensions();
  // console.log("id", id);
  const { headerImage, htmlContent, htmlStyles } = useMemo(() => {
    if (!post) return { headerImage: null, htmlContent: "", htmlStyles: {} };
    const { processedHtml } = processHTMLContent(post.content);
    const styles = StyleSheet.create({
      p: { fontSize: 16, lineHeight: 24, color: "#e5e5e5", marginBottom: 16 },
      h2: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
        marginVertical: 16,
      },
      h3: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffffff",
        marginVertical: 16,
      },
      strong: { fontWeight: "bold", color: "#ffffff" },
      a: { color: "#bb86fc", textDecorationLine: "underline" },
      blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: "#7c3aed",
        backgroundColor: "#27272a",
        padding: 12,
        marginVertical: 16,
        borderRadius: 4,
      },
      img: {
        width: width - 32,
        height: 200,
        marginVertical: 16,
        borderRadius: 8,
      },
      li: { color: "#e5e5e5", marginBottom: 8 },
    });
    return {
      headerImage: post.downloadURL,
      htmlContent: processedHtml,
      htmlStyles: styles,
    };
  }, [post, width]);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "React Native | A framework for building native apps using React",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  if (isPending) return <LoadingState />;
  if (isError || !post)
    return <ErrorState message={error?.message || "An error occurred"} />;

  return (
    <ScrollView
      className="flex-1 bg-zinc-900"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Button onPress={onShare} className="bg-blue-500 mb-4 mx-4">
        <Ionicons name="share-outline" size={24} color="#fff" />
        Share
      </Button>
      {headerImage && (
        <Card className="mb-4 mx-0 overflow-hidden" elevation={3}>
          <Card.Cover
            source={{ uri: headerImage }}
            className="h-60"
            resizeMode="cover"
          />
        </Card>
      )}
      <View className="px-4 py-2">
        <ArticleHeader
          title={post.title}
          postedBy={post.postedBy}
          createdAt={post.createdAt}
          category={post.category}
        />
        <Divider className="my-4 bg-gray-700" />
        <HTMLView
          value={htmlContent}
          stylesheet={htmlStyles}
          addLineBreaks={false}
          renderNode={(node, index, siblings, parent, defaultRenderer) => {
            if (node.name === "img") {
              const { src, alt } = node.attribs;
              return (
                <View key={index} className="my-4">
                  <Image
                    source={{ uri: src }}
                    style={{
                      width: width - 32,
                      height: 200,
                      resizeMode: "cover",
                      borderRadius: 8,
                      backgroundColor: "#1f2937",
                    }}
                    accessibilityLabel={alt || "Article image"}
                  />
                  {alt && (
                    <Text className="text-sm text-gray-400 mt-1 text-center">
                      {alt}
                    </Text>
                  )}
                </View>
              );
            }
            if (node.name === "blockquote") {
              return (
                <View
                  key={index}
                  className="border-l-4 border-purple-600 pl-4 my-4 bg-zinc-800 p-3 rounded-md"
                >
                  {defaultRenderer(node.children, parent)}
                </View>
              );
            }
            if (node.name === "h2" || node.name === "h3") {
              return (
                <Text
                  key={index}
                  className={`text-xl font-bold text-white my-4`}
                >
                  {defaultRenderer(node.children, parent)}
                </Text>
              );
            }
            if (node.name === "iframe") {
              const { src } = node.attribs;
              return src ? <VideoPlayer key={index} src={src} /> : null;
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default NewsContent;
