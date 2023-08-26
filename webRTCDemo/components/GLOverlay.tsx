import React, { useRef, useState, useEffect } from "react";
import { GLView } from "expo-gl";
import * as GL from "expo-gl";
import { View, StyleSheet, ViewStyle, Dimensions } from "react-native";
export const HEIGHT = Dimensions.get("window").height;
export const WIDTH = Dimensions.get("window").width;

import { rectPointsToTriangles } from "../utils/helpers";

interface Props {}

const compileShaders = async (gl: GL.ExpoWebGLRenderingContext) => {
  const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(
    vertShader,
    `#version 300 es
  precision highp float;
  in vec2 position;
  void main() {
    gl_Position = vec4(position, 0, 1);
  }`
  );
  gl.compileShader(vertShader);
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(
    fragShader,
    `#version 300 es
  precision highp float;
  out vec4 fragColor;
  void main() {
    fragColor = vec4(1,0,0,1);
  }`
  );
  gl.compileShader(fragShader);

  const compiledSuccessfullyVert = gl.getShaderParameter(
    vertShader,
    gl.COMPILE_STATUS
  );
  if (!compiledSuccessfullyVert) {
    const compilationLog = gl.getShaderInfoLog(vertShader);
    console.error(`Shader compilation error: ${compilationLog}`);
  } else {
    console.log("Vertex shader compiled Successfully");
  }
  const compiledSuccessfullyFrag = gl.getShaderParameter(
    fragShader,
    gl.COMPILE_STATUS
  );
  if (!compiledSuccessfullyFrag) {
    const compilationLog = gl.getShaderInfoLog(fragShader);
    console.error(`Shader compilation error: ${compilationLog}`);
  } else {
    console.log("Fragment shader compiled Successfully");
  }
  return { vertShader, fragShader };
};
const programSetup = async (
  gl: GL.ExpoWebGLRenderingContext,
  vertShader: WebGLShader,
  fragShader: WebGLShader
) => {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  gl.validateProgram(program);
  const positionAttrib = gl.getAttribLocation(program, "position");
  const buffer = gl.createBuffer();
  return { program, positionAttrib, buffer };
};

const GLOverlay = () => {
  const glRef = useRef(null);
  const [rafID, setRafId] = useState<null | number>(null);

  useEffect(() => {
    return () => {
      if (rafID !== undefined && rafID != null) {
        cancelAnimationFrame(rafID);
      }
    };
  }, []);

  const onContextCreate = async (gl: GL.ExpoWebGLRenderingContext) => {
    const { vertShader, fragShader } = await compileShaders(gl);
    const { program, positionAttrib, buffer } = await programSetup(
      gl,
      vertShader,
      fragShader
    );

    // Render loop #########################################################################################
    //######################################################################################################
    const animate = () => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // // Create camera texture every frame
      // this.createCameraTexture().then((cameraTexture) => {
      //   this.texture = cameraTexture;
      //   // Bind texture
      //   gl.activeTexture(gl.TEXTURE0);
      //   gl.bindTexture(gl.TEXTURE_2D, cameraTexture);
      //   // Set 'cameraTexture' uniform
      //   if (cameraTextureLocation !== null) {
      //     gl.uniform1i(cameraTextureLocation, 0);
      //   }
      // });

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttrib);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

      // let xt = 1 * Math.sin((rafID ? rafID : 0 * Math.PI) / 180);
      // const bufferData = new Float32Array([
      //   -0.25 + xt,
      //   -0.25,
      //   0.25 + xt,
      //   -0.25,
      //   0 + xt,
      //   0.25,
      // ]);
      let rafID = requestAnimationFrame(animate);
      setRafId(rafID);

      let xMov = 1 * Math.sin((rafID ? rafID : 0 * Math.PI) / 180) - 0.5;
      let yMov = 1 * Math.sin((rafID ? rafID : 0 * Math.PI) / 180) + 0.75;

      const bufferData = new Float32Array([
        ...rectPointsToTriangles([0 + xMov, -0.25, 0.5, 0.5], 0.025),
        ...rectPointsToTriangles([0, -0.75 + yMov, 0.4, 0.25], 0.025),
      ]);

      gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, bufferData.length / 2);

      // Submit frame
      gl.flush();
      gl.endFrameEXP();
    };
    animate();
  };

  return (
    <GLView
      style={{
        height: HEIGHT,
        width: WIDTH,
        position: "absolute",
        zIndex: 2,
        top: 0,
        left: 0,
        right: 0,
      }}
      onContextCreate={onContextCreate}
      ref={glRef}
    />
  );
};

export default GLOverlay;
