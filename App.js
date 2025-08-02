import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import OfflineStatus from './src/components/OfflineStatus';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TaskProvider } from './src/utils/TaskContext';
import AuthScreen from './src/screens/AuthScreen';
import MainTabs from './src/navigation';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import * as Notifications from 'expo-notifications';
import { trackAppLaunch, trackUserLogin } from './src/utils/analytics';

const Stack = createStackNavigator();

import React, { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/utils/firebase';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [user, setUser] = useState(null);
  
  React.useEffect(() => {
    // Track app launch
    trackAppLaunch();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Track user login
        trackUserLogin();
      }
    });
    return unsubscribe;
  }, []);

  return (
    <TaskProvider>
      <GestureHandlerRootView style={styles.container}>
        {/* OfflineStatus is now shown only in BoardScreen and CloudSyncScreen */}
        {user ? (
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="BoardSelect">
              <Stack.Screen name="BoardSelect" component={require('./src/screens/BoardSelectScreen').default} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ headerShown: true, title: 'Task Details' }} />
            </Stack.Navigator>
            <StatusBar style="light" />
          </NavigationContainer>
        ) : (
          <AuthScreen onAuthSuccess={setUser} />
        )}
      </GestureHandlerRootView>
    </TaskProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
