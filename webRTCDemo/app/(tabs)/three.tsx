import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";

import io from "socket.io-client";
import { useFocusEffect } from "expo-router";

type CameraStream = { uri: string };

export default function TabThreeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>Tab 3</Text>
    </View>
  );
}
