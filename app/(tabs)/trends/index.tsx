import Category from "@/app/(tabs)/trends/[category]";
import { ScrollView, Text } from "react-native";

const Index = () => {
  return (
    <ScrollView>
      <Text className="text-red-500 mb-4">Trends</Text>
      <Category />
    </ScrollView>
  );
};

export default Index;
