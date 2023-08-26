import React, { useEffect, useCallback, useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { View, StyleSheet, ViewStyle, Dimensions } from "react-native";
export const HEIGHT = Dimensions.get("window").height;
export const WIDTH = Dimensions.get("window").width;

const screenAspectRatio = HEIGHT / WIDTH;

type AspectRatioSize = { width: number; height: number };

interface Props {
  height: number;
  cameraRef: React.MutableRefObject<Camera | null>;
}

const CameraComponent = ({ height, cameraRef }: Props) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const containerStyle: ViewStyle = {
    height: height,
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  };

  const cameraStyle: ViewStyle = {
    aspectRatio: 9 / 16,
    height: undefined,
    width: "100%",
  };

  // const isHeightInScreen = (aspectRatioDecimal: number): boolean => {
  //   return WIDTH * aspectRatioDecimal < HEIGHT;
  // };

  // const getCameraAspectRatioAndImageSize = async (cameraRefCurrent: Camera) => {
  //   const sizes = await cameraRefCurrent.getSupportedRatiosAsync();
  //   let bestSize: AspectRatioSize = { width: 0, height: 0 };
  //   let bestAspectRatioDiff = Number.POSITIVE_INFINITY;
  //   for (const ratio of sizes) {
  //     const [height, width] = ratio.split(":");
  //     const aspectRatio = parseFloat(height) / parseFloat(width);
  //     const aspectRatioDiff = Math.abs(aspectRatio - screenAspectRatio);
  //     if (
  //       aspectRatioDiff < bestAspectRatioDiff &&
  //       isHeightInScreen(aspectRatio)
  //     ) {
  //       bestSize = { width: parseInt(width), height: parseInt(height) };
  //       bestAspectRatioDiff = aspectRatioDiff;
  //     }
  //   }
  //   if (isNaN(bestSize.width) || isNaN(bestSize.height)) {
  //     throw new Error("PHONE CAMERA ASPECT RATIO NOT DETECTED");
  //   }
  //   dispatch(setAspectRatio(`${bestSize.height}:${bestSize.width}`));
  //   const pictureSizes = await cameraRefCurrent.getAvailablePictureSizesAsync(
  //     `${bestSize.height}:${bestSize.width}`
  //   );
  //   let smallestImageHeight = Number.POSITIVE_INFINITY;
  //   let smallestImageWidth = Number.POSITIVE_INFINITY;

  //   for (const pictureSize of pictureSizes) {
  //     const [strHeight, strWidth] = pictureSize.split("x");
  //     let height = parseInt(strHeight);
  //     let width = parseInt(strWidth);
  //     //Target image size for model is 300x300, this will ensure we pick an image size closest to that value
  //     if (
  //       height < smallestImageHeight &&
  //       width < smallestImageWidth &&
  //       height >= 300 &&
  //       width >= 300
  //     ) {
  //       smallestImageHeight = height;
  //       smallestImageWidth = width;
  //     }
  //   }
  //   dispatch(
  //     batchActions([
  //       setImageHeight(smallestImageHeight),
  //       setImageWidth(smallestImageWidth),
  //     ])
  //   );
  // };

  // useEffect(() => {
  //   const asyncReqPermission = async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     if (status == "granted") {
  //       setPermissions(true);
  //     } else {
  //       setPermissions(false);
  //     }
  //   };
  //   asyncReqPermission();
  //   return () => {
  //     cameraRef.current = null;
  //   };
  // }, []);

  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  // useEffect(() => {
  //   const adjustPreviewSize = async () => {
  //     if (cameraReady && cameraRef.current) {
  //       await getCameraAspectRatioAndImageSize(cameraRef.current);
  //     }
  //   };
  //   if (cameraReady) {
  //     adjustPreviewSize();
  //   }
  // }, [cameraReady]);

  return (
    <View style={[containerStyle]}>
      {permission?.status == "granted" && (
        <Camera
          style={[cameraStyle]}
          type={CameraType.back}
          ref={(ref) => (cameraRef.current = ref!)}
          zoom={0}
          onCameraReady={handleCameraReady}
        />
      )}
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
});
