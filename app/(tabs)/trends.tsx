import Category from "@/components/shared/category";
import Posts from "@/components/shared/posts";
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
const Trends = () => {
  return (
    <ScrollView>
      <Text className="text-red-500 mb-4">Trends</Text>
      <View className="flex-row flex-wrap">
        {DATA.map((item) => (
          <Item key={item} title={item} />
        ))}
      </View>
      <Category/>
      <Posts />
    </ScrollView>
  );
};

export default Trends;
