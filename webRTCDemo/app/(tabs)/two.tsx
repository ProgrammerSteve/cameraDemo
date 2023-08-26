import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  AutoFocus,
  Camera,
  CameraCapturedPicture,
  CameraPictureOptions,
  FlashMode,
} from "expo-camera";

import io, { Socket } from "socket.io-client";
import { useFocusEffect } from "expo-router";

type CameraStream = { uri: string };

const backendUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}`;
// const socket = io(backendUrl); // Replace with your server URL

export default function TabTwoScreen() {
  const [isCameraReady, setCameraReady] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [screenShown, setScreenShown] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  // const [cameraStream, setCameraStream] = useState<CameraStream | null>(null);

  const cameraRef = useRef<Camera | null>(null);

  useFocusEffect(
    useCallback(() => {
      initializeSocket();
      setScreenShown(true);
      return () => {
        console.log("disconnecting from server...");
        setScreenShown(false);
        if (isSocketConnected) setIsSocketConnected(false);
        if (socket) {
          socket.emit("disconnect");
          setSocket(null);
        }
      };
    }, [])
  );

  useEffect(() => {
    if (isCameraReady) {
      const getPictureSizes = async () => {
        if (!cameraRef.current) return;
        const pictureSizes =
          await cameraRef.current.getAvailablePictureSizesAsync(`16:9`);
        const [height, width] = pictureSizes[0].split("x");
        console.log("height:", height);
        console.log("width:", width);
        setImageHeight(parseInt(height));
        setImageWidth(parseInt(width));

        console.log("picture sizes:", pictureSizes);
      };

      getPictureSizes();
    }
  }, [isCameraReady]);

  const initializeSocket = async () => {
    console.log("initalizing socket...");
    const newSocket = io(backendUrl);
    if (!newSocket) {
      console.log("newSocket is null/undefined");
    } else {
      newSocket.on("connect", () => {
        setSocket(newSocket);
        console.log("Connected to server");
        setIsSocketConnected(true);
      });

      newSocket.on("processedFrame", (processedFrameData) => {
        // Process and display the processed frame data in your app
        console.log("ProcessedFrameData:", processedFrameData);
      });
    }
  };

  const startStreaming = async () => {
    if (!isCameraReady || !cameraRef.current) return;
    // const cameraStream = await cameraRef.current.recordAsync();
    // setCameraStream(cameraStream);
    let options: CameraPictureOptions = {
      exif: false,
      skipProcessing: true,
      base64: true,
    };
    const snapshot = await cameraRef.current.takePictureAsync(options);
    sendSnapshotToServer(snapshot);
    // sendFramesToServer(cameraStream);
  };

  const sendSnapshotToServer = async (snapshot: CameraCapturedPicture) => {
    if (!socket) return;
    if (!snapshot.uri) return;

    let base64 = snapshot.base64;

    const frame = { data: base64 };

    // Send the snapshot to the server
    socket.emit("videoFrame", frame);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {screenShown && (
        <Camera
          autoFocus={AutoFocus.off}
          flashMode={FlashMode.off}
          ratio={"16:9"}
          style={{
            aspectRatio: 9 / 16,
            height: undefined,
            width: "80%",
          }}
          pictureSize={
            imageWidth !== 0 && imageHeight !== 0
              ? `${imageHeight}x${imageWidth}`
              : undefined
          }
          onCameraReady={() => setCameraReady(true)}
          ref={cameraRef}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "white" }}>
              SocketConnected:{isSocketConnected ? "true" : "false"}
            </Text>

            <View>
              <TouchableOpacity onPress={startStreaming}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  Start Streaming
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      )}
    </View>
  );
}

// const sendFramesToServer = async(stream: CameraStream) => {
//   if (!stream.uri) return;
//   const frames: string[] = []; // Collect frames from the stream
//   const cameraStream = await Camera.getCameraStreamAsync(stream.uri);
//   const videoTrack = cameraStream.getVideoTracks()[0];

//   const mediaRecorder = new MediaRecorder(cameraStream, {
//     mimeType: "video/webm; codecs=vp8", // Use appropriate MIME type
//   });

//   mediaRecorder.ondataavailable = async (event) => {
//     if (event.data.size > 0) {
//       const blob = new Blob([event.data], { type: "video/webm" });
//       const arrayBuffer = await blob.arrayBuffer();
//       const base64Data = btoa(
//         String.fromCharCode(...new Uint8Array(arrayBuffer))
//       );
//       frames.push(base64Data);
//     }
//   };

//   mediaRecorder.start();

//   const sendInterval = setInterval(() => {
//     if (frames.length > 0) {
//       // Send frames to the server
//       socket.emit("videoFrames", frames);
//       frames.length = 0; // Clear the frames array
//     }
//   }, 1000); // Adjust the interval as needed (e.g., every second)
// };
