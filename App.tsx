import { Canvas, Circle, useCanvasRef } from "@shopify/react-native-skia";
import { HierarchyCircularNode, color, hierarchy, pack, style } from "d3";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  PixelRatio,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, { useDerivedValue, withTiming } from "react-native-reanimated";
import { useZoomGesture } from "./hooks/useZoomGesture";
import { LinearGradient } from "expo-linear-gradient";

interface DataNode {
  id: number;
  name: string;
  value?: number; // Marking `value` as optional
  children?: DataNode[]; // Recursively applying the interface
}

const data: DataNode = {
  id: 1,
  name: "Spendable Outputs",
  children: [
    { id: 2, name: "biggest", value: 20511 },
    { id: 3, name: "bigger", value: 10351 },
    { id: 4, name: "big", value: 9351 },
    { id: 12, name: "big", value: 6351 },
    { id: 13, name: "big", value: 5084 },
    {
      id: 5,
      name: "medium",
      value: 743,
    },
    {
      id: 6,
      name: "medium",
      value: 393,
    },
    {
      id: 7,
      name: "small",
      value: 343,
    },
    {
      id: 14,
      name: "medium",
      value: 93,
    },
    {
      id: 15,
      name: "smallest",
      value: 143,
    },
    {
      id: 8,
      name: "medium",
      value: 543,
    },
    {
      id: 9,
      name: "smallest",
      value: 143,
    },
    {
      id: 10,
      name: "smaller",
      value: 243,
    },
  ],
};

const MeasureText = ({ style, circleWidth, circleHeight, children }) => {
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const hasMeasuredRef = useRef(false);

  const onTextLayout = (event) => {
    if (!hasMeasuredRef.current) {
      const { width, height } = event.nativeEvent.layout;
      setTextWidth(width);
      setTextHeight(height);
      hasMeasuredRef.current = true;
    }
  };

  console.log({ circleWidth, textHeight });

  return (
    <Text
      style={[
        style,
        {
          top: circleHeight / 2 - textHeight / 2,
          left: circleWidth / 2 - textWidth / 2,
        },
      ]}
      onLayout={onTextLayout}
    >
      {/* {textHeight < circleHeight - 20 ? children : null} */}
      {children}
    </Text>
  );
};

export default function App() {
  const pixelRatio = PixelRatio.get();
  const { width, height } = Dimensions.get("window");

  let GRAPH_HEIGHT = 400;
  const GRAPH_WIDTH = width;

  const [canvasSize, setCanvasSize] = useState({
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
  });

  const animalsHierarchy = () => hierarchy(data).sum((d) => d.value);
  const createPack = pack().size([GRAPH_WIDTH, GRAPH_HEIGHT]).padding(8);
  const animalsPack = createPack(
    animalsHierarchy()
  ).descendants() as HierarchyCircularNode<DataNode>[];

  const {
    zoomGesture,
    onLayout,
    onLayoutContent,
    contentContainerAnimatedStyle,
  } = useZoomGesture({});

  let [selectedCircle, setSelectedCircle] = useState([]);

  let onPressCircle = (data, index) => () => {
    if (index === 0) return;
    if (selectedCircle.includes(data.id)) {
      return setSelectedCircle(selectedCircle.filter((id) => id !== data.id));
    }
    setSelectedCircle([...selectedCircle, data.id]);
    // setSelectedCircle([]);
  };

  return (
    <GestureHandlerRootView style={[styles.fill]}>
      <GestureDetector gesture={zoomGesture}>
        <SafeAreaView
          style={[styles.fill]}
          collapsable={false}
          onLayout={onLayout}
        >
          <View
            style={{
              flex: 1,
              position: "relative",
              paddingTop: 100,
            }}
          >
            <LinearGradient
              style={[
                styles.topContainer,

                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 80,
                  pointerEvents: "none",
                },
              ]}
              colors={["#000000F5", "#000000A6", "#0000004B", "#00000000"]}
            >
              <Pressable
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flex: 1,
                }}
                onPress={() => {
                  console.log("tap");
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "#ADADAD",
                  }}
                >
                  Group
                </Text>
              </Pressable>
              <View
                style={{
                  flexDirection: "column",
                  flex: 4,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 9,
                }}
              >
                <Text style={styles.title}>Select spendable outputs</Text>
                <Text style={[styles.title, { opacity: 0.8 }]}>{`${
                  selectedCircle.length
                } of ${animalsPack.slice(1).length} selected`}</Text>
                <View style={{ flexDirection: "row", gap: 2 }}>
                  <Text style={{ fontSize: 9, color: "#5E5E5E" }}>Total </Text>
                  <Text style={{ fontSize: 9, color: "#D0D0D0" }}>
                    159,321{" "}
                  </Text>
                  <Text style={{ fontSize: 9, color: "#5E5E5E" }}>sats </Text>
                  <Text style={{ fontSize: 9, color: "#D0D0D0" }}>326.32 </Text>
                  <Text style={{ fontSize: 9, color: "#5E5E5E" }}>USD</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "baseline",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 46,
                      fontWeight: "200",
                      color: "#D0D0D0",
                    }}
                  >
                    14,476
                  </Text>
                  <Text style={{ fontSize: 18, color: "#5E5E5E" }}>sats </Text>
                </View>

                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "200",
                    opacity: 0.45,
                    color: "#fff",
                  }}
                >
                  27.25 USD
                </Text>
              </View>
              <Pressable
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flex: 1,
                }}
                onPress={() => {
                  console.log("tap");
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    gap: 4,
                    alignItems: "flex-end",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      width: 30,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderBottomWidth: 1,
                        borderColor: "#ADADAD",
                      }}
                    ></View>
                    <View
                      style={{
                        flex: 3,
                        borderBottomWidth: 1,
                        borderColor: "#ADADAD",
                      }}
                    ></View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      width: 30,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderBottomWidth: 1,
                        borderColor: "#ADADAD",
                      }}
                    ></View>
                    <View
                      style={{
                        flex: 3,
                        borderBottomWidth: 1,
                        borderColor: "#ADADAD",
                      }}
                    ></View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      width: 30,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderBottomWidth: 1,
                        borderColor: "#ADADAD",
                      }}
                    ></View>
                    <View
                      style={{
                        flex: 3,
                        borderBottomWidth: 1,
                        borderColor: "#ADADAD",
                      }}
                    ></View>
                  </View>
                </View>
              </Pressable>
            </LinearGradient>
            <Animated.View
              style={[styles.container, contentContainerAnimatedStyle]}
            >
              <Canvas
                style={[
                  {
                    ...canvasSize,
                    // borderStyle: "solid",
                    // borderWidth: 1,
                    // borderColor: "red",
                  },
                ]}
                onLayout={onLayoutContent}
              >
                {animalsPack.slice().map(({ x, y, r, data, depth }, index) => {
                  const bgColor = useDerivedValue(() => {
                    if (selectedCircle.includes(data.id)) {
                      return withTiming("white");
                    } else {
                      return withTiming("#6B6B6B");
                    }
                  });

                  return (
                    <Circle
                      cx={x}
                      cy={y}
                      r={r}
                      color={data?.children ? "#131313" : bgColor}
                      style="fill"
                      key={data.id}
                    ></Circle>
                  );
                })}
              </Canvas>

              <Animated.View
                style={[
                  {
                    ...canvasSize,
                    position: "absolute",
                  },
                ]}
                onLayout={onLayoutContent}
              >
                {animalsPack
                  .slice()
                  .map(({ x, y, r, data, depth, ...rest }, index) => {
                    const textColor = () => {
                      if (selectedCircle.includes(data.id)) {
                        return "#6B6B6B";
                      } else {
                        return "white";
                      }
                    };
                    return (
                      <Pressable
                        key={data.id}
                        onPress={onPressCircle(data, index)}
                      >
                        <Animated.View
                          style={{
                            borderRadius: r,
                            width: r * 2,
                            height: r * 2,
                            backgroundColor: "transparent",
                            position: "absolute",
                            left: x - r,
                            top: y - r,
                          }}
                          key={index}
                        >
                          <MeasureText
                            circleHeight={r * 2}
                            circleWidth={r * 2}
                            style={{
                              position: "absolute",
                              color: textColor,
                              fontSize: r * 2 * 0.16,
                            }}
                          >
                            {data.value}
                          </MeasureText>
                        </Animated.View>
                      </Pressable>
                    );
                  })}
              </Animated.View>
            </Animated.View>
            <Pressable
              style={styles.button}
              onPress={() => {
                console.log("tap");
              }}
            >
              <Text style={styles.text}>ADD AS INPUTS TO MESSAGE</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: "#131313",
  },
  container: {
    flex: 1,
    backgroundColor: "#131313",
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    marginHorizontal: 20,
  },
  topContainer: {
    flex: 1,
    position: "absolute",
    zIndex: 1,
  },
  title: {
    color: "white",
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "300",
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 30,
    marginLeft: 30,
    color: "#131313",
  },
});
