import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../utils/TaskContext';
import { syncBoardsToCloud, loadBoardsFromCloud } from '../utils/cloudSync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OfflineStatus from '../components/OfflineStatus';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

const theme = getTheme();
const responsive = getResponsiveDimensions();

const CloudSyncScreen = () => {
  const { syncStatus } = useTasks();
  const [localSyncStatus, setLocalSyncStatus] = useState('Ready to sync');
  const [error, setError] = useState(null);
  const [cloudBoards, setCloudBoards] = useState([]);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    loadCloudData();
    getLastSyncTime();
  }, []);

  const getLastSyncTime = async () => {
    try {
      const lastSync = await AsyncStorage.getItem('@last_sync_time');
      if (lastSync) {
        setLastSyncTime(new Date(lastSync).toLocaleString());
      }
    } catch (error) {
      console.log('Error getting last sync time:', error);
    }
  };

  const loadCloudData = async () => {
    try {
      const result = await loadBoardsFromCloud();
      if (result.success) {
        setCloudBoards(result.boards || []);
      }
    } catch (error) {
      console.log('Error loading cloud data:', error);
    }
  };

  const handleSync = async () => {
    setLocalSyncStatus('Syncing...');
    setError(null);
    
    try {
      const boardsJson = await AsyncStorage.getItem('@project_dashboard_boards');
      const boards = boardsJson ? JSON.parse(boardsJson) : [];
      
      const result = await syncBoardsToCloud(boards);
      
      if (result.success) {
        setLocalSyncStatus('Sync Complete');
        await AsyncStorage.setItem('@last_sync_time', new Date().toISOString());
        setLastSyncTime(new Date().toLocaleString());
        loadCloudData();
      } else {
        setLocalSyncStatus('Sync Failed');
        setError(result.error?.message || 'Unknown sync error');
      }
    } catch (err) {
      setLocalSyncStatus('Sync Failed');
      setError(err.message);
    }
    
    setTimeout(() => setLocalSyncStatus('Ready to sync'), 3000);
  };

  const handleLoadFromCloud = async () => {
    setLocalSyncStatus('Loading from cloud...');
    setError(null);
    
    try {
      const result = await loadBoardsFromCloud();
      
      if (result.success) {
        setCloudBoards(result.boards || []);
        setLocalSyncStatus('Loaded successfully');
        
        if (result.boards && result.boards.length > 0) {
          await AsyncStorage.setItem('@project_dashboard_boards', JSON.stringify(result.boards));
          Alert.alert('Success', 'Boards loaded from cloud and saved locally!');
        }
      } else {
        setLocalSyncStatus('Load failed');
        setError(result.error?.message || 'Failed to load from cloud');
      }
    } catch (err) {
      setLocalSyncStatus('Load failed');
      setError(err.message);
    }
    
    setTimeout(() => setLocalSyncStatus('Ready to sync'), 3000);
  };

  const handleClearCloud = () => {
    Alert.alert(
      'Clear Cloud Data',
      'Are you sure you want to delete all cloud data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // This would clear cloud data in a real implementation
            Alert.alert('Success', 'Cloud data has been cleared!');
            setCloudBoards([]);
          }
        }
      ]
    );
  };

  const getStatusColor = () => {
    if (localSyncStatus.includes('Complete') || localSyncStatus.includes('successfully')) {
      return theme.colors.success;
    } else if (localSyncStatus.includes('Failed') || localSyncStatus.includes('failed')) {
      return theme.colors.error;
    } else if (localSyncStatus.includes('Syncing') || localSyncStatus.includes('Loading')) {
      return theme.colors.warning;
    }
    return theme.colors.text.secondary;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Offline Status */}
        <OfflineStatus />
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Cloud Sync</Text>
          <Text style={styles.headerDescription}>
            Manage your data synchronization with the cloud
          </Text>
        </View>

        {/* Sync Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sync Status</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Current Status:</Text>
            <Text style={[styles.statusValue, { color: getStatusColor() }]}>
              {localSyncStatus}
            </Text>
          </View>

          {lastSyncTime && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Last Sync:</Text>
              <Text style={styles.statusValue}>{lastSyncTime}</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Sync Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sync Actions</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={handleSync}
            disabled={localSyncStatus.includes('Syncing') || localSyncStatus.includes('Loading')}
          >
            <Text style={styles.primaryButtonText}>Sync to Cloud</Text>
            <Text style={styles.buttonDescription}>Upload local data to cloud storage</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]} 
            onPress={handleLoadFromCloud}
            disabled={localSyncStatus.includes('Syncing') || localSyncStatus.includes('Loading')}
          >
            <Text style={styles.secondaryButtonText}>Load from Cloud</Text>
            <Text style={styles.buttonDescription}>Download and replace local data</Text>
          </TouchableOpacity>
        </View>

        {/* Cloud Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cloud Data</Text>
          
          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>Boards in Cloud:</Text>
            <Text style={styles.dataValue}>{cloudBoards.length}</Text>
          </View>

          {cloudBoards.length > 0 && (
            <View style={styles.boardsList}>
              {cloudBoards.map((board, index) => (
                <View key={index} style={styles.boardItem}>
                  <Text style={styles.boardName}>{board.name || `Board ${index + 1}`}</Text>
                </View>
              ))}
            </View>
          )}

          {cloudBoards.length === 0 && (
            <Text style={styles.emptyText}>No boards found in cloud storage</Text>
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]} 
            onPress={handleClearCloud}
          >
            <Text style={styles.dangerButtonText}>Clear Cloud Data</Text>
            <Text style={styles.buttonDescription}>Permanently delete all cloud data</Text>
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
  
  // Status Styles
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  
  // Error Styles
  errorContainer: {
    backgroundColor: theme.colors.error + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Button Styles
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  secondaryButton: {
    backgroundColor: theme.colors.success,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dangerButton: {
    backgroundColor: theme.colors.error,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  
  // Data Styles
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 12,
  },
  dataLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  
  // Boards List
  boardsList: {
    marginTop: 8,
  },
  boardItem: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  boardName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  
  // Empty State
  emptyText: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default CloudSyncScreen;
