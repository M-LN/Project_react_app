import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';

const AuthScreen = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        onAuthSuccess(user);
      }
    });
    return unsubscribe;
  }, []);

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Sign in anonymously to use your Kanban dashboard.</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <Button title="Sign In Anonymously" onPress={handleAnonymousSignIn} color="#2196F3" />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 16,
    fontSize: 15,
  },
});

export default AuthScreen;
