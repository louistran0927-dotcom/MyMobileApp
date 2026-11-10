import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter</Text>
      <Text testID="count" style={styles.count}>
        {count}
      </Text>
      <View style={styles.row}>
        <Pressable
          testID="decrement"
          style={styles.button}
          onPress={() => setCount((c) => c - 1)}
        >
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Pressable
          testID="increment"
          style={styles.button}
          onPress={() => setCount((c) => c + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
      <Pressable
        testID="reset"
        style={styles.reset}
        onPress={() => setCount(0)}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reset: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#8e8e93',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
});
