import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";

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
  <View className="p-2 bg-blue-500 rounded-lg ">
    <Text className="text-white">{title}</Text>
  </View>
);
const TrendLayout = () => {
  return (
    <>
      <View className="flex-row  flex-wrap gap-2 px-2 py-8 ">
        {DATA.map((item) => (
          <Link href={`/trends/${item}`} key={item} asChild>
            <Pressable>
              <Item title={item} />
            </Pressable>
          </Link>
        ))}
      </View>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "index", headerShown: false }}
        />
        <Stack.Screen
          name="[category]"
          options={{ title: "category", headerShown: false }}
        />
      </Stack>
    </>
  );
};

export default TrendLayout;
