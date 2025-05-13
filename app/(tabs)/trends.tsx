import { FlatList, Text, View } from "react-native";

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
    <View>
      <Text className="text-red-500">Trends</Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item} />}
        keyExtractor={(item) => item}
        numColumns={5}
      />
    </View>
  );
};

export default Trends;
