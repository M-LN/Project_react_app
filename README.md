# 📱 Personal Project Dashboard - Kanban App

A production-ready mobile task management application built with React Native and Expo, featuring cloud sync, real-time updates, and modern UI/UX design.

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 🚀 Features

### 📋 Core Functionality
- **Kanban Board Management** - Create, edit, and organize multiple boards
- **Task Management** - Full CRUD operations with drag-and-drop
- **Cross-Column Movement** - Intuitive task status updates
- **Real-time Search & Filtering** - Find tasks instantly across all boards
- **Priority Management** - Visual priority indicators with colored triangles
- **Due Date Tracking** - Smart date displays and overdue highlighting
- **Progress Tracking** - Visual progress bars for in-progress tasks

### ☁️ Cloud & Sync
- **Firebase Integration** - Automatic cloud sync with Firestore
- **Real-time Updates** - Live synchronization across devices
- **Offline Support** - Works offline with automatic sync when reconnected
- **User Authentication** - Anonymous authentication for data security
- **Cross-Device Access** - Access your data from any device

### 📱 Mobile Experience
- **iPhone Optimized** - Specifically optimized for iPhone 11 and newer
- **Responsive Design** - Adaptive layouts for all screen sizes
- **Touch-Friendly UI** - Large touch targets and intuitive gestures
- **Professional Design** - Modern, clean interface with consistent theming
- **Safe Area Support** - Proper handling of home indicators and notches

### 🔔 Notifications & Analytics
- **Push Notifications** - Task reminders and status updates
- **Firebase Analytics** - Comprehensive usage tracking
- **Productivity Metrics** - Track completion rates and task times
- **Notification Settings** - Customizable reminder preferences

### 🎨 UI/UX Enhancements
- **Enhanced Task Cards** - Priority indicators, progress bars, tags
- **Floating Action Button** - Quick access to 6 common actions
- **Search & Filter Panel** - Advanced filtering capabilities
- **Smooth Animations** - Micro-interactions and visual feedback
- **Dark Theme Ready** - Complete dark mode implementation

### 📎 Additional Features
- **Image Attachments** - Add photos to tasks (local storage)
- **Multiple Boards** - Organize different projects separately
- **Quick Actions Modal** - Fast task creation and board management
- **Offline Indicator** - Clear connection status display

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo SDK 53
- **Cloud Backend**: Firebase (Firestore, Authentication, Analytics)
- **State Management**: React Context API with automatic cloud sync
- **Navigation**: React Navigation 6 with bottom tabs
- **Animations**: React Native Reanimated & Gesture Handler
- **Storage**: AsyncStorage (local) + Firestore (cloud)
- **Notifications**: Expo Notifications with scheduling
- **Build System**: EAS Build for production deployments

## � Screenshots

> Add screenshots of your app here when you test it on your device

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator or physical iOS device
- Firebase project (for cloud features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personal-kanban-dashboard.git
   cd personal-kanban-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (Anonymous)
   - Enable Analytics
   - Add Firebase config to `src/utils/firebase.js`

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device**
   - Install Expo Go on your phone
   - Scan the QR code from the terminal
   - Or use iOS Simulator: Press `i` in terminal

### Firebase Configuration

Create a Firebase project and update `src/utils/firebase.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── EnhancedTaskCard.js    # Rich task cards with priority/progress
│   ├── FloatingActionButton.js # Modern FAB with quick actions
│   ├── KanbanColumn.js        # Kanban columns with drag-and-drop
│   ├── QuickActionsModal.js   # Bottom sheet with 6 quick actions
│   ├── SearchBar.js           # Real-time search and filtering
│   └── TaskCard.js           # Basic task card component
├── navigation/          # Navigation configuration
│   └── index.js              # Bottom tab navigation with safe area
├── screens/            # Screen components
│   ├── AnalyticsScreen.js    # Productivity metrics and charts
│   ├── BoardScreen.js        # Main Kanban board with all features
│   ├── BoardsScreen.js       # Board selection and management
│   ├── NotificationsScreen.js # Notification settings and management
│   ├── SettingsScreen.js     # App settings and preferences
│   └── TaskDetailScreen.js   # Task creation and editing
└── utils/              # Helper functions and utilities
    ├── analytics.js          # Firebase Analytics tracking
    ├── firebase.js           # Firebase configuration and init
    ├── notifications.js      # Push notification management
    ├── responsive.js         # Responsive design utilities
    ├── TaskCloudStorage.js   # Cloud sync for tasks
    ├── TaskContext.js        # Global state management
    ├── TaskStorage.js        # Local storage management
    └── theme.js              # Design system and theming
```

## 🎯 Key Components

### TaskContext
Central state management for tasks and boards with automatic cloud sync, real-time updates, and offline support.

### EnhancedTaskCard
Rich task cards featuring:
- Priority indicators with colored corner triangles
- Progress bars for in-progress tasks
- Smart due date displays ("Due today", "Overdue by 2 days")
- Tag support with colored badges
- Attachment and time estimate indicators

### Firebase Integration
- **Authentication**: Anonymous user authentication for data privacy
- **Firestore**: Real-time cloud database with offline caching
- **Analytics**: User engagement and productivity tracking

### Responsive Design
Mobile-first design with specific optimizations for iPhone 11 and newer devices, including safe area handling for home indicators.

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

### Building for Production

1. **Setup EAS Build**
   ```bash
   npm install -g @expo/cli
   eas login
   eas build:configure
   ```

2. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

3. **Build for Android**
   ```bash
   eas build --platform android
   ```

## 📊 Analytics & Tracking

The app includes comprehensive analytics tracking:

- **User Engagement**: App usage patterns and session duration
- **Feature Usage**: Most used features and user interaction flows
- **Productivity Metrics**: Task completion rates and board activity
- **Performance**: App errors and crash reporting

View analytics in your Firebase Console under the Analytics section.

## � Notifications

Push notifications are implemented for:

- **Task Reminders**: 1 day before due date at 9 AM
- **Status Updates**: When tasks are moved between columns
- **Completion Notifications**: When tasks are marked as done

Note: Full notification functionality requires a development build or production app (limited in Expo Go).

## 🎨 Theming & Design

The app features a comprehensive design system:

- **Colors**: Professional palette with high contrast ratios
- **Typography**: 6-level hierarchy (h1-h3, body, caption, small)
- **Spacing**: Consistent 6-level spacing scale (xs: 4px to xxl: 48px)
- **Shadows**: 3-level elevation system (sm, md, lg)
- **Responsive**: Adaptive sizing for all device types
- **Animations**: Spring-based micro-interactions

## � Data Model

Tasks follow this comprehensive structure:

```javascript
{
  id: "uuid",
  title: "Task title",
  description: "Task description",
  status: "todo" | "inprogress" | "done",
  priority: "low" | "medium" | "high",
  dueDate: "YYYY-MM-DD",
  tags: ["tag1", "tag2"],
  attachments: [],
  progress: 0-100,
  timeEstimate: minutes,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🚀 Deployment Options

### Option 1: Expo Go (Development)
- Install Expo Go on your device
- Scan QR code from development server
- Perfect for testing and development

### Option 2: Development Build
- Requires Apple Developer account ($99/year)
- Full native functionality including notifications
- Install directly on device without App Store

### Option 3: App Store Distribution
- Submit to iOS App Store and Google Play Store
- Full production deployment
- Requires developer accounts and review process

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Cloud services by [Firebase](https://firebase.google.com/)
- UI inspiration from modern task management apps
- React Native community for excellent libraries and support

## 📧 Contact

**Your Name** - your.email@example.com

Project Link: [https://github.com/yourusername/personal-kanban-dashboard](https://github.com/yourusername/personal-kanban-dashboard)

---

⭐ **Star this repository if it helped you!**

📱 **Ready to revolutionize your task management? Start using this Kanban dashboard today!**
