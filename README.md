# 🏋️ Fitness Tracker PWA

A comprehensive Progressive Web App (PWA) for fitness tracking built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

### 🏃‍♀️ Workout Management
- **Exercise Library**: 100+ exercises across 8 categories (chest, arms, abs, legs, back, shoulders, cardio, full-body)
- **Workout Creation**: Build custom workouts with focus area selection
- **Calendar Scheduling**: Plan and schedule workouts in advance
- **Progress Tracking**: Track workout completion and history

### 🍎 Nutrition Tracking
- **Protein Focus**: Optimized for protein intake tracking
- **Quick Add**: One-tap logging with common food presets
- **Detailed Logging**: Full nutrition entry with meal timing
- **Progress Visualization**: Daily protein goals and progress bars
- **Weekly Analytics**: Track averages and trends

### 📸 Progress Photos
- **Camera Integration**: Take progress photos with composition grid
- **Photo Gallery**: View photos in a beautiful grid layout
- **Statistics**: Track photo streaks and milestones
- **Workout Association**: Link photos to specific workouts

### 📱 Mobile-First Design
- **Progressive Web App**: Install on any device
- **Responsive Design**: Optimized for mobile and desktop
- **Touch-Friendly**: Large touch targets and smooth interactions
- **Offline Support**: Local database storage with IndexedDB

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitness-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Database Layer
- **IndexedDB**: Local storage using Dexie.js
- **Tables**: Workouts, Nutrition, Progress Photos, Templates
- **CRUD Operations**: Full database abstraction layer

### State Management
- **Custom Hooks**: `useWorkouts`, `useNutrition`, `useCamera`
- **React Context**: Minimal global state
- **Local Storage**: Persistent user preferences

### Component Structure
```
src/
├── components/
│   ├── layout/          # Layout components
│   ├── workout/         # Workout-related components
│   ├── nutrition/       # Nutrition tracking components
│   ├── progress/        # Progress photo components
│   └── calendar/        # Calendar view components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and database
├── types/               # TypeScript type definitions
└── app/                 # Next.js 14 app directory
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font**: Inter (system font fallback)
- **Sizes**: Tailwind CSS utility classes
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## 📚 API Reference

### Custom Hooks

#### `useWorkouts()`
```typescript
const {
  workouts,
  loading,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getUpcomingWorkouts
} = useWorkouts();
```

#### `useNutrition()`
```typescript
const {
  todaysEntries,
  getTodaysProteinTotal,
  addNutritionEntry,
  quickAddProtein
} = useNutrition();
```

#### `useCamera()`
```typescript
const {
  photos,
  takePhoto,
  deletePhoto,
  hasPermission,
  isSupported
} = useCamera();
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure build settings (automatically detected)
3. Deploy with automatic CI/CD

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `.next` folder to your hosting provider
3. Configure environment variables if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Roadmap

- [ ] Workout execution with timers
- [ ] Exercise form videos/animations
- [ ] Social features and sharing
- [ ] Nutrition calorie tracking
- [ ] Integration with fitness wearables
- [ ] Data export functionality
- [ ] Multiple user profiles

## 🐛 Known Issues

- Camera permissions need to be granted on first use
- PWA install prompt varies by browser
- Some features require modern browser APIs

## 📞 Support

For questions or support, please [open an issue](https://github.com/your-username/fitness-tracker/issues) on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS. 