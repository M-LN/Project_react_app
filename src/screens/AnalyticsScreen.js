import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../utils/TaskContext';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';
import { trackScreenView, trackProductivityMetrics } from '../utils/analytics';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

const { width } = Dimensions.get('window');
const theme = getTheme();
const responsive = getResponsiveDimensions();

const AnalyticsScreen = ({ route }) => {
  // Get boardId from navigation params, default to '1'
  const boardId = route?.params?.boardId || '1';
  const { tasksByBoard: contextTasksByBoard } = useTasks() || {};
  const tasksByBoard = contextTasksByBoard || {};
  const tasks = Array.isArray(tasksByBoard[boardId]) ? tasksByBoard[boardId] : [];

  const [stats, setStats] = useState({ total: 0, todo: 0, inprogress: 0, done: 0 });
  const [completionData, setCompletionData] = useState({ labels: [], data: [] });
  const [activeDays, setActiveDays] = useState({ labels: [], data: [] });

  useEffect(() => {
    // Track screen view
    trackScreenView('AnalyticsScreen');
    
    const boardTasks = tasksByBoard[boardId] || [];
    const newStats = {
      total: boardTasks.length,
      todo: boardTasks.filter(t => t.status === 'todo').length,
      inprogress: boardTasks.filter(t => t.status === 'inprogress').length,
      done: boardTasks.filter(t => t.status === 'done').length,
    };
    setStats(newStats);

    // Track productivity metrics
    const averageTaskTime = 7; // Example: average 7 days per task
    const activeBoards = Object.keys(tasksByBoard).length;
    trackProductivityMetrics(newStats.done, averageTaskTime, activeBoards);

    // Completion rate by day
    const days = {};
    boardTasks.forEach(t => {
      if (t.status === 'done' && t.createdAt) {
        const day = new Date(t.createdAt).toLocaleDateString();
        days[day] = (days[day] || 0) + 1;
      }
    });
    setCompletionData({
      labels: Object.keys(days),
      data: Object.values(days),
    });

    // Most active days
    const active = {};
    boardTasks.forEach(t => {
      if (t.createdAt) {
        const day = new Date(t.createdAt).toLocaleDateString();
        active[day] = (active[day] || 0) + 1;
      }
    });
    setActiveDays({
      labels: Object.keys(active),
      data: Object.values(active),
    });
  }, [boardId, tasksByBoard]);

  const chartWidth = Dimensions.get('window').width - 32;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.headerBox, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="stats-chart-outline" size={responsive.isSmallPhone ? 24 : 28} color={theme.colors.primary} style={{ marginBottom: 4 }} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Analytics Dashboard</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>Visualize your board's progress and activity. Use these charts to spot trends and improve your workflow.</Text>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Ionicons name="pie-chart-outline" size={responsive.isSmallPhone ? 16 : 18} color={theme.colors.primary} /> Task Status
        </Text>
      {(stats.todo + stats.inprogress + stats.done > 0) ? (
        <PieChart
          data={Array.isArray([
            { name: 'To Do', population: stats.todo, color: '#FF9800', legendFontColor: '#333', legendFontSize: 14 },
            { name: 'In Progress', population: stats.inprogress, color: '#2196F3', legendFontColor: '#333', legendFontSize: 14 },
            { name: 'Done', population: stats.done, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 14 }
          ]) ? [
            { name: 'To Do', population: stats.todo, color: '#FF9800', legendFontColor: '#333', legendFontSize: 14 },
            { name: 'In Progress', population: stats.inprogress, color: '#2196F3', legendFontColor: '#333', legendFontSize: 14 },
            { name: 'Done', population: stats.done, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 14 }
          ] : []}
          width={chartWidth}
          height={180}
          chartConfig={pieConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="16"
          absolute
          style={styles.chart}
        />
        ) : (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>No task status data available.</Text>
        )}
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Ionicons name="trending-up-outline" size={responsive.isSmallPhone ? 16 : 18} color={theme.colors.primary} /> Completion Rate by Day
        </Text>
        {(Array.isArray(completionData.labels) && completionData.labels.length > 0) ? (
          <LineChart
            data={{
              labels: Array.isArray(completionData.labels) ? completionData.labels : [],
              datasets: Array.isArray(completionData.data) ? [{ data: completionData.data }] : [{ data: [] }],
            }}
            width={chartWidth}
            height={180}
            chartConfig={lineConfig}
            bezier
            style={styles.chart}
          />
        ) : (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>No completion data available.</Text>
        )}
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Ionicons name="calendar-outline" size={responsive.isSmallPhone ? 16 : 18} color={theme.colors.primary} /> Most Active Days
        </Text>
        {(Array.isArray(activeDays.labels) && activeDays.labels.length > 0) ? (
          <BarChart
            data={{
              labels: Array.isArray(activeDays.labels) ? activeDays.labels : [],
              datasets: Array.isArray(activeDays.data) ? [{ data: activeDays.data }] : [{ data: [] }],
            }}
            width={chartWidth}
            height={180}
            chartConfig={barConfig}
            style={styles.chart}
          />
        ) : (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>No activity data available.</Text>
        )}
      <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>Tip: Tap a chart legend for more details. Filter and export features coming soon.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const pieConfig = {
  backgroundColor: '#fff',
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
};
const lineConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  backgroundColor: '#fff',
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // green line
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  strokeWidth: 3,
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#4CAF50',
    fill: '#fff',
  },
};
const barConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  backgroundColor: '#fff',
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // blue bars
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  strokeWidth: 2,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: responsive.spacing.md,
    paddingBottom: responsive.spacing.xl,
  },
  headerBox: {
    alignItems: 'center',
    marginTop: responsive.spacing.lg,
    marginBottom: responsive.spacing.md,
    padding: responsive.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  title: {
    fontSize: responsive.isSmallPhone ? 18 : 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: responsive.spacing.xs,
  },
  description: {
    fontSize: responsive.isSmallPhone ? 12 : 14,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: responsive.spacing.sm,
  },
  sectionTitle: {
    fontSize: responsive.isSmallPhone ? 14 : 16,
    fontWeight: '600',
    marginTop: responsive.spacing.lg,
    marginBottom: responsive.spacing.md,
    paddingHorizontal: responsive.spacing.sm,
  },
  subtitle: {
    fontSize: responsive.isSmallPhone ? 12 : 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginVertical: responsive.spacing.lg,
    fontStyle: 'italic',
  },
  hint: {
    fontSize: responsive.isSmallPhone ? 11 : 12,
    textAlign: 'center',
    marginTop: responsive.spacing.lg,
    marginBottom: responsive.spacing.md,
    paddingHorizontal: responsive.spacing.md,
    fontStyle: 'italic',
  },
  chart: {
    marginVertical: responsive.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
});

export default AnalyticsScreen;
