import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OfflineStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <Text style={styles.text}>
      Offline: Changes will sync when reconnected
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default OfflineStatus;
