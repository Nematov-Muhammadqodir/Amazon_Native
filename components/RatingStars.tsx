import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";

interface RatingStarsProps {
  rating: number;
  max?: number;
}

export default function RatingStars({ rating, max = 5 }: RatingStarsProps) {
  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: max }).map((_, index) => (
        <Text key={index} style={{ fontSize: 18 }}>
          {index < rating ? (
            <FontAwesome name="star" size={24} color="#FFC84F" />
          ) : (
            <FontAwesome name="star-o" size={24} color="#FFC84F" />
          )}
        </Text>
      ))}
    </View>
  );
}
