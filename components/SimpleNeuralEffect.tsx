import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const LINE_COUNT = 20;

export default function SimpleNeuralEffect() {
  const [offsets, setOffsets] = useState<number[]>([]);

  useEffect(() => {
    const init = Array.from({ length: LINE_COUNT }, () => Math.random() * height);
    setOffsets(init);

    const interval = setInterval(() => {
      setOffsets((prev) =>
        prev.map((v) => (v > height ? 0 : v + Math.random() * 10 + 2))
      );
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {offsets.map((y, i) => {
        const x = (width / LINE_COUNT) * i + Math.random() * 4;
        return (
          <View
            key={i}
            style={[
              styles.line,
              {
                left: x,
                top: y,
                opacity: 0.1 + Math.random() * 0.3,
              },
            ]}
          />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    width: 1.2,
    height: 80,
    backgroundColor: 'rgba(0,255,180,0.6)',
    borderRadius: 1,
  },
});
