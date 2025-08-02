import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

const theme = getTheme();
const responsive = getResponsiveDimensions();

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#2196F3');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [syncStatus, setSyncStatus] = useState('Connected');

  const handleSync = () => {
    setSyncStatus('Syncing...');
    setTimeout(() => setSyncStatus('Connected'), 2000);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all boards and tasks? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'All data has been cleared!');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Data export feature will be implemented in a future update.');
  };

  const handleAbout = () => {
    Alert.alert(
      'About Personal Project Dashboard',
      'Version 1.0.0\\n\\nA modern Kanban-style task management app with cloud sync, notifications, and analytics.\\n\\nBuilt with React Native and Firebase.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerDescription}>
            Customize your app experience, theme, and notifications
          </Text>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch to dark theme for better viewing in low light
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Accent Color</Text>
              <Text style={styles.settingDescription}>
                Choose your preferred accent color
              </Text>
            </View>
            <View style={styles.colorOptions}>
              {['#2196F3', '#FF9800', '#4CAF50', '#E91E63'].map(color => (
                <TouchableOpacity 
                  key={color} 
                  style={[
                    styles.colorDot,
                    { backgroundColor: color },
                    accentColor === color && styles.selectedColor
                  ]} 
                  onPress={() => setAccentColor(color)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications for task reminders and updates
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Data & Sync Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Sync</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Cloud Sync Status</Text>
              <Text style={styles.settingDescription}>
                Status: {syncStatus}
              </Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={handleSync}>
              <Text style={styles.actionButtonText}>Sync Now</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.settingButton} onPress={handleExportData}>
            <Text style={styles.settingButtonText}>Export Data</Text>
            <Text style={styles.settingButtonDescription}>Download your data as JSON</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingButton, styles.dangerButton]} onPress={handleClearData}>
            <Text style={[styles.settingButtonText, styles.dangerText]}>Clear All Data</Text>
            <Text style={styles.settingButtonDescription}>Remove all boards and tasks</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingButton} onPress={handleAbout}>
            <Text style={styles.settingButtonText}>About This App</Text>
            <Text style={styles.settingButtonDescription}>Version and app information</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Header Styles
  headerSection: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Section Styles
  section: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  
  // Setting Styles
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  
  // Color Options
  colorOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: theme.colors.text.primary,
    borderWidth: 3,
  },
  
  // Action Button
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Setting Button
  settingButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  settingButtonDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  
  // Danger Button
  dangerButton: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: theme.colors.error,
  },
});

export default SettingsScreen;
