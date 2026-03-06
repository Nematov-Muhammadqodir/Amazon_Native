import { images } from "@/constants";
import { Video } from "expo-av";
import { Image, StyleSheet, View } from "react-native";

export default function MultipleBanner() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={images.makkaPaya}
          resizeMode="cover"
        />
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.rightImageContainer}>
          <Image
            style={styles.rightImage}
            resizeMode="cover"
            source={require("../../assets/images/aboutUs/pomidor.jpg")}
          />
        </View>
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
            style={styles.video}
            useNativeControls={false}
            resizeMode="cover"
            shouldPlay={true} // set to true if you want autoplay
            isLooping={true}
            isMuted={true}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
    flexDirection: "row",
    height: 400,
    width: 400,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  imageContainer: { width: 190, height: 400, borderRadius: 8 },
  rightContainer: {
    width: 190,
    height: 400,
    justifyContent: "space-between",
  },
  rightImageContainer: { width: 190, height: 195, borderRadius: 8 },
  rightImage: { width: 180, height: 195, borderRadius: 8 },
  image: { width: 180, height: 400, borderRadius: 8 },
  videoContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    width: 180,
    height: 195,
    borderRadius: 8,
  },
  video: {
    width: 180,
    height: 195,
    borderRadius: 8,
  },
});
