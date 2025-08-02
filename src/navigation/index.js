import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

import BoardScreen from '../screens/BoardScreen';
import BoardsScreen from '../screens/BoardsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CloudSyncScreen from '../screens/CloudSyncScreen';

const Tab = createBottomTabNavigator();
const theme = getTheme();
const responsive = getResponsiveDimensions();

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      initialRouteName="Board"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: Math.max(insets.bottom + 4, 12), // Ensure minimum 12px bottom padding
          paddingTop: 8, // Add top padding for better spacing
          height: Math.max(insets.bottom + 58, 70), // Ensure minimum 70px height
        },
        tabBarLabelStyle: {
          fontSize: responsive.isSmallPhone ? 10 : 11,
          fontWeight: '500',
          marginBottom: 2, // Add slight margin for better spacing
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Board':
              iconName = 'grid-outline';
              break;
            case 'Boards':
              iconName = 'albums-outline';
              break;
            case 'Analytics':
              iconName = 'stats-chart-outline';
              break;
            case 'Notifications':
              iconName = 'notifications-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            case 'CloudSync':
              iconName = 'cloud-upload-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={responsive.isSmallPhone ? 20 : 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Board" component={BoardScreen} />
      <Tab.Screen name="Boards" component={BoardsScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="CloudSync" component={CloudSyncScreen} />
    </Tab.Navigator>
  );
}
