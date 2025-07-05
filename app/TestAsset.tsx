import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Asset } from 'expo-asset';

export default function TestAsset() {
  useEffect(() => {
    const test = async () => {
      try {
        const asset = Asset.fromModule(require('../assets/model/model.json'));
        await asset.downloadAsync();
        console.log('✅ localUri:', asset.localUri);
      } catch (e) {
        console.log('❌ Error:', e);
      }
    };
    test();
  }, []);

  return (
    <View>
      <Text>Test Asset Load</Text>
    </View>
  );
}
