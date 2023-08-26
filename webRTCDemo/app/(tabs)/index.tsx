import { View, StyleSheet, ViewStyle, Dimensions } from "react-native";
export const HEIGHT = Dimensions.get("window").height;
export const WIDTH = Dimensions.get("window").width;
import { Camera } from "expo-camera";
import { useRef, useCallback, useState, useEffect } from "react";
import CameraComponent from "../../components/CameraComponent";
import { useFocusEffect, useRouter } from "expo-router";
import GLOverlay from "../../components/GLOverlay";

export default function TabOneScreen() {
  const cameraRef = useRef<Camera | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useFocusEffect(
    useCallback(() => {
      const getPermission = async () => {
        await requestPermission();
      };
      getPermission();

      return () => {};
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (permission?.status == "granted") {
        setIsFocused(true);
      }
      return () => {
        setIsFocused(false);
      };
    }, [permission])
  );

  return (
    <View style={styles.container}>
      {isFocused && (
        <>
          <CameraComponent height={HEIGHT} cameraRef={cameraRef} />
          <GLOverlay />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});
