# Copilot Instructions for Personal Project Dashboard

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React Native Expo project for a Personal Project Dashboard - a mobile-first Kanban-style task management app.

## Key Technologies
- React Native with Expo
- React Navigation for screen navigation
- AsyncStorage for local data persistence
- react-native-draggable-flatlist for drag-and-drop Kanban functionality
- React Native Gesture Handler and Reanimated for smooth animations

## Project Structure
- `/src/components` - Reusable UI components (TaskCard, Column, etc.)
- `/src/screens` - Screen components (Board, TaskDetail, Settings)
- `/src/navigation` - Navigation configuration
- `/src/utils` - Helper functions and storage logic

## Code Style Guidelines
- Use functional components with React hooks
- Follow React Native best practices for mobile development
- Implement responsive design for mobile-first experience
- Use TypeScript-style prop validation where possible
- Keep components modular and reusable

## Key Features to Implement
- Kanban board with drag-and-drop functionality
- Task creation, editing, and deletion
- Local storage with AsyncStorage
- Mobile-optimized UI/UX
- Future-ready for cloud sync integration

## Data Model
Tasks should follow this structure:
```js
{
  id: "uuid",
  title: "Task title",
  description: "Task description",
  status: "todo" | "inprogress" | "done",
  dueDate: "YYYY-MM-DD",
  attachments: []
}
```

When generating code, prioritize mobile usability, performance, and maintainability.
