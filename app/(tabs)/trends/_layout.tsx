import { AntDesign, Feather } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const DATA = [
  "General",
  "Business",
  "Culture",
  "Education",
  "Entertainment",
  "Fashion",
  "Food",
  "Health",
  "Investment",
  "Lifestyle",
  "Politics",
  "Religion",
  "Science",
  "Sports",
  "Technology",
  "Travel",
];

type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <View>
    <Text className="text-white p-2 bg-gray-500 m-2 rounded-lg">{title}</Text>
  </View>
);
const TrendsLayout = () => {
  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView
      // horizontal
      // showsHorizontalScrollIndicator={false}
      // className="bg-black"
      >
        <View className="flex-row flex-wrap p-2">
          {DATA.map((item) => (
            <Link href={`/(tabs)/trends/${item}`} key={item}>
              <Item key={item} title={item} />
            </Link>
          ))}
        </View>
      </ScrollView>
      {/* Routes inside the Trends layout */}
      <Stack></Stack>
    </View>
  );
};

export default TrendsLayout;
