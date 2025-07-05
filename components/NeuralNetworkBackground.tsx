import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const NODE_COUNT = 12;

// Colores por clase
const classStyles: Record<string, { color: string; glow: string; size: number }> = {
  plastico: { color: 'rgba(0,255,100,0.4)', glow: '#00ff80', size: 12 },
  carton: { color: 'rgba(255,140,0,0.4)', glow: '#ff8800', size: 12 },
  vidrio: { color: 'rgba(0,180,255,0.4)', glow: '#00ccff', size: 12 },
  metal: { color: 'rgba(255,0,255,0.4)', glow: '#ff00ff', size: 12 },
  papel: { color: 'rgba(255,255,255,0.4)', glow: '#ffffff', size: 10 },
  pila: { color: 'rgba(255,0,0,0.4)', glow: '#ff3333', size: 16 }, // 🔴 más grande
  otro: { color: 'rgba(200,200,200,0.3)', glow: '#888', size: 10 },
};

const generateNodes = (classes: string[]) => {
  return Array.from({ length: NODE_COUNT }).map((_, i) => {
    const label = classes[i % classes.length] || 'otro';
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      label,
    };
  });
};

export default function NeuralNetworkBackground({ classes = [] }: { classes: string[] }) {
  const nodes = generateNodes(classes.length > 0 ? classes : ['otro']);

  const offsets = nodes.map(() => ({
    x: useSharedValue(0),
    y: useSharedValue(0),
    pulse: useSharedValue(1),
  }));

  useEffect(() => {
    offsets.forEach((offset) => {
      offset.x.value = withRepeat(
        withTiming(Math.random() * 20 - 10, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
      offset.y.value = withRepeat(
        withTiming(Math.random() * 20 - 10, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
      offset.pulse.value = withRepeat(
        withTiming(1.4, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    });
  }, []);

  return (
    <>
      <Svg
        width={width}
        height={height}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        {nodes.map((n1, i) =>
          nodes.map((n2, j) => {
            if (i >= j) return null;
            return (
              <Line
                key={`${i}-${j}`}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="rgba(0,150,255,0.15)"
                strokeWidth="1.5"
              />
            );
          })
        )}
      </Svg>

      {nodes.map((node, i) => {
        const { color, glow, size } = classStyles[node.label] || classStyles.otro;

        const style = useAnimatedStyle(() => ({
          transform: [
            { translateX: node.x + offsets[i].x.value },
            { translateY: node.y + offsets[i].y.value },
            { scale: offsets[i].pulse.value },
          ],
          opacity: 0.3,
        }));

        return (
          <Animated.View
            key={i}
            style={[
              style,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                position: 'absolute',
                shadowColor: glow,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 10,
              },
            ]}
          />
        );
      })}
    </>
  );
}
