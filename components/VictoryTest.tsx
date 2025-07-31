import React from 'react';
import { View } from 'react-native';
import { VictoryChart, VictoryLine } from 'victory';

export default function VictoryTest() {
  return (
    <View style={{ height: 200 }}>
      <VictoryChart>
        <VictoryLine data={[{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 1 }]} />
      </VictoryChart>
    </View>
  );
}
